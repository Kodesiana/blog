---
title: 'Operation Name tidak Muncul di Azure AppInsight?🤔'
categories: Programming
tags: [backend, azure, appinsights, fastapi, python]
date: 2023-07-14
---

Azure AppInsight merupakan salah satu layanan Azure yang sangat membantu developer untuk melakukan *distributed tracing* aplikasi *backend* dan *frontend*[1]. Penulis sangat sering menggunakan layanan di beberapa proyek karena layanan ini *gratis* (selama penggunaannya di bawah 50 GB per bulan) dan juga mudah untuk diintegrasikan ke aplikasi ASP.NET Core dan Python FastAPI. Selain itu, karena AppInsight merupakan layanan Azure, penulis tidak perlu langganan ke aplikasi *3rd party* lain untuk melakukan *tracing* seperti DataDog atau Sentry = lebih mudah untuk di-*manage*. Tapi sayangnya, ketika penulis mengintegrasikan AppInsight ke aplikasi berbasis Python FastAPI, *operation name* yang seharusnya berisi *path* API yang di-*hit* malah tidak muncul🧐

![Azure AppInsights](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/operation-name-azure/appinsight_comp.png)

Pada artikel ini penulis akan berbagi pengalaman mengenai metode integrasi AppInsights yang benar dan bagaimana penulis berhasil mengatasi kolom *operation name* yang tidak muncul di Azure AppInsight.

## 🦄 Implementasi OpenCensus pada FastAPI

Pada umumnya kita bisa menggunakan standar OpenCensus untuk melakukan *instrumentation* pada aplikasi *backend FastAPI*. Azure AppInsight sendiri merekomendasikan untuk menggunakan ekstensi OpenCensus Azure untuk mengirimkan *log* dan *trace* ke Azure AppInsights.

Lalu bagaimana cara integrasi AppInsight dengan FastAPI yang benar?

Potongan kode di bawah ini adalah contoh *middleware*[2,6] yang disarankan oleh Microsoft untuk mengintegrasikan AppInsight ke aplikasi FastAPI.

```python
# Opencensus imports
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer
from opencensus.trace.span import SpanKind
from opencensus.trace.attributes_helper import COMMON_ATTRIBUTES
# FastAPI imports
from fastapi import FastAPI, Request
# uvicorn
import uvicorn

app = FastAPI()

HTTP_URL = COMMON_ATTRIBUTES['HTTP_URL']
HTTP_STATUS_CODE = COMMON_ATTRIBUTES['HTTP_STATUS_CODE']

exporter=AzureExporter(connection_string='<your-appinsights-connection-string-here>')
sampler=ProbabilitySampler(1.0)

# fastapi middleware for opencensus
@app.middleware("http")
async def middlewareOpencensus(request: Request, call_next):
    tracer = Tracer(exporter=exporter, sampler=sampler)
    with tracer.span("main") as span:
        span.span_kind = SpanKind.SERVER

        response = await call_next(request)

        tracer.add_attribute_to_current_span(attribute_key=HTTP_STATUS_CODE, attribute_value=response.status_code)
        tracer.add_attribute_to_current_span(attribute_key=HTTP_URL, attribute_value=str(request.url))

    return response
```

Setelah kita *deploy* aplikasi kita dengan menggunakan *middleware* di atas, kita bisa melihat aplikasi kita sudah berhasil di-*trace* oleh Azure AppInsight. Tapi jika kita lihat pada menu  **Failures**, pada kolom **OPERATION NAME** isinya hanya ada *Overall* dan *<Empty>*, kenapa?🧐

![Operation name tidak ada di Azure AppInsights](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/operation-name-azure/operation_name_missing_comp.png)

## 😫 Kenapa Operation Name tidak Muncul?

Sampai di sini penulis juga agak kebingungan, kenapa di aplikasi ASP.NET semua fiturnya bisa langsung oke, tapi di aplikasi Python FastAPI *operation name* ini tidak muncul?

*Karena bukan produk Microsoft kali ya wkwk*

Setelah penulis mencari informasi, penulis menyimpulkan bahwa AppInsight menggunakan informasi atribut `ai.operation.name`. Sayangnya, untuk mengubah atribut ini, prosesnya perlu dilakukan melalui *telemetry preprocessor*[3] dan informasi mengenai *request* Starlette FastAPI tidak tersedia di dalam *preprocessor* ini, sehingga meskipun atribut `ai.operation.name` bisa di set di *preprocessor*, tapi hanya bisa statis.

Penulis mulai bertanya-tanya, kenapa *role* ini hanya bisa di set melalui *preprocessor?* Harusnya bisa lebih mudah di setting karena proses ini harusnya fitur dasar dari AppInsights.

Sayangnya, informasi mengenai cara *setting* atribut ini tidak tersedia di dokumentasi AppInsight manapun, sehingga penulis akhirnya memeriksa *source code* dari `opencensus-ext-azure` untuk mengecek apakah *role* tersebut bisa di set melalui *Tracer*.

Potongan kode dari `opencesus-ext-azure`[4]

```python
if HTTP_ROUTE in sd.attributes:
  data.name = data.name + ' ' + sd.attributes[HTTP_ROUTE]
  envelope.tags['ai.operation.name'] = data.name
  data.properties['request.name'] = data.name
```

**Eureka!**

Ternyata kita perlu menambahkan atribut `HTTP_ROUTE` pada atribut di dalam `Span` agar role `ai.operation.name` bisa di set otomatis pada *envelope*.

Berdasarkan informasi ini, penulis hanya perlu mengganti sedikit kode *tracing* dari dokumentasi Azure ke versi yang benar.

## 💥 Implementasi yang Benar

Berikut adalah versi *tracing* yang penulis gunakan.

```python
# opencensus
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer
from opencensus.trace.span import SpanKind
from opencensus.trace.attributes_helper import COMMON_ATTRIBUTES

# fastapi
from fastapi import FastAPI, Request

# fastapi app
app = FastAPI(title=settings.APP_NAME)

# azure app insights
sampler = ProbabilitySampler(1.0)
exporter = AzureExporter(connection_string='<your-appinsights-connection-string-here>')

# fastapi middleware for opencensus
@app.middleware("http")
async def middlewareOpencensus(request: Request, call_next):
    # create tracer
    tracer = Tracer(exporter=exporter, sampler=sampler)

    # create span
    with tracer.span("main") as span:
        # set span type to server
        span.span_kind = SpanKind.SERVER

        # call next middleware
        response = await call_next(request)

        # get matched route
        matched_route = ""
        if "route" in request.scope:
            matched_route = request.scope['route'].path
        else:
            matched_route = request.scope['path']

        # add metadata
        tracer.add_attribute_to_current_span(attribute_key=COMMON_ATTRIBUTES['HTTP_HOST'], attribute_value=str(request.url.hostname))
        tracer.add_attribute_to_current_span(attribute_key=COMMON_ATTRIBUTES['HTTP_METHOD'], attribute_value=str(request.method))
        tracer.add_attribute_to_current_span(attribute_key=COMMON_ATTRIBUTES['HTTP_PATH'], attribute_value=str(request.url.path))
        tracer.add_attribute_to_current_span(attribute_key=COMMON_ATTRIBUTES['HTTP_ROUTE'], attribute_value=str(matched_route))
        tracer.add_attribute_to_current_span(attribute_key=COMMON_ATTRIBUTES['HTTP_STATUS_CODE'], attribute_value=response.status_code)

    # return original response
    return response
```

Secara umum penulis menambahkan beberapa atribut baru seperti `HTTP_HOST`, `HTTP_ROUTE`, dan atribut lain untuk melengkapi data telemetri ke AppInsight. Setelah dilakukan perubahan di atas, akhirnya *operation name* muncul di menu **Failures**!

![Operation name muncul di Azure AppInsights](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/operation-name-azure/opreation_name_exists_comp.png)

### 🥳April 2023: `FastAPIMiddleware`

Per April 2023 lalu, OpenCensus menambahkan *middleware tracing* baru yang sudah mengintegrasikan atribut-atribut tadi ke data telemetri AppInsight[5,6,7]. `pip install opencensus-ext-fastapi`.

```python
from fastapi import FastAPI
from opencensus.ext.fastapi.fastapi_middleware import FastAPIMiddleware

app = FastAPI(__name__)
app.add_middleware(FastAPIMiddleware)
```

Kita juga bisa menggunakan pengaturan tambahan seperti di bawah ini

```python
app.add_middleware(
    FastAPIMiddleware,
    excludelist_paths=["paths"],
    excludelist_hostnames=["hostnames"],
    sampler=sampler,
    exporter=exporter,
    propagator=propagator,
)
```

Per 26 April lalu, metode integrasi AppInsight dengan menggunakan *middleware* ini sudah menjadi standar di dokumentasi Microsoft[8].

## 😐 Penutup

Setelah beberapa hari penulis mencari informasi, akhirnya masalah ini bisa disolusikan dengan menginputkan atribut *tracing* yang lengkap pada `Span`.

Beberapa pertanyaan yang muncul,

1. Kenapa hal kecil tentang setting atribut `HTTP_ROUTE` tidak ada di dokumentasi?
2. Kenapa contoh kode integrasi di dokumentasi tidak menggunakan atribut yang lengkap?

Sayang sekali, pengalaman ini menunjukkan bahwa ekosistem Azure AppInsight belum *mature* dibandingkan DataDog dan kompetitor lainnya. Semoga Azure khususnya AppInsight bisa terus berkembang menjadi lebih baik dan lebih mudah digunakan oleh banyak orang.😁

## ✏️ Referensi

1. Microsoft. [Application Insights Overview](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview). Diakses 03 Juli 2023.
2. Microsoft. 2023. [Track incoming requests with OpenCensus Python](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opencensus-python-request#track-fastapi-applications). Diakses 02 Juli 2023.
3. Microsoft. 2023. [Filter and preprocess telemetry in the Application Insights SDK](https://learn.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling?tabs=javascriptwebsdkloaderscript#opencensus-python-telemetry-processors). Diakses 03 Juli 2023.
4. Microsoft. 2023. [__init__.py opencensus-python](https://github.com/census-instrumentation/opencensus-python/blob/3a2d8dfe1db4e0129dc691c35901a0d12127afc1/contrib/opencensus-ext-azure/opencensus/ext/azure/trace_exporter/__init__.py#L45). Diakses 02 Juli 2023.
5. NixBiks dan gkocjan. 2021. [Integration with fastapi](https://github.com/census-instrumentation/opencensus-python/issues/1020). Diakses 02 Juli 2023.
6. ikait. 2023. [fastapi_middleware.py opencensus-python](https://github.com/census-instrumentation/opencensus-python/blob/3a2d8dfe1db4e0129dc691c35901a0d12127afc1/contrib/opencensus-ext-fastapi/opencensus/ext/fastapi/fastapi_middleware.py#L55). Diakses 02 Juli 2023.
7. OpenCensus. 2023. [OpenCensus FastAPI Integration](https://github.com/census-instrumentation/opencensus-python/tree/master/contrib/opencensus-ext-fastapi). Diakses 03 Juli 2023.
8. Microsoft. 2023. [Update documentation about opencensus fastapi plugin](https://github.com/MicrosoftDocs/azure-docs/commit/4c54e112db7debc468e32dd01df7b0bfa8a0633e). Diakses 02 Juli 2023.
