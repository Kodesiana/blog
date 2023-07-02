---
title: 'Operation Name tidak Muncul di Azure AppInsight?🤔'
categories: Programming
tags: [backend, azure, fastapi, python]
date: 2023-07-14
draft: true
---

## 🦄 Implementasi OpenCensus pada FastAPI


### Versi Dokumentasi Azure

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

        tracer.add_attribute_to_current_span(
            attribute_key=HTTP_STATUS_CODE,
            attribute_value=response.status_code)
        tracer.add_attribute_to_current_span(
            attribute_key=HTTP_URL,
            attribute_value=str(request.url))

    return response
```

![Operation name tidak ada di Azure AppInsights](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/operation-name-azure/operation_name_missing_comp.png)

### Versi Penulis

```python
# opencensus
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer
from opencensus.trace.span import SpanKind
from opencensus.trace.attributes_helper import COMMON_ATTRIBUTES
from opencensus.trace import config_integration
from opencensus.ext.azure.log_exporter import AzureLogHandler

# fastapi
from fastapi import FastAPI, Request

# fastapi app
app = FastAPI(title=settings.APP_NAME)

# azure app insights
sampler = ProbabilitySampler(1.0)
exporter = AzureExporter(connection_string=settings.APPLICATIONINSIGHTS_CONNECTION_STRING)
handler = AzureLogHandler(connection_string=settings.APPLICATIONINSIGHTS_CONNECTION_STRING)

# add log to app insights
handler.setFormatter(logging.Formatter("%(traceId)s %(spanId)s %(message)s"))
logger.addHandler(handler)

# configure azure app insights tracing
config_integration.trace_integrations(["logging", "requests"])

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
        tracer.add_attribute_to_current_span(
            attribute_key=COMMON_ATTRIBUTES['HTTP_HOST'],
            attribute_value=str(request.url.hostname))
        tracer.add_attribute_to_current_span(
            attribute_key=COMMON_ATTRIBUTES['HTTP_METHOD'],
            attribute_value=str(request.method))
        tracer.add_attribute_to_current_span(
            attribute_key=COMMON_ATTRIBUTES['HTTP_PATH'],
            attribute_value=str(request.url.path))
        tracer.add_attribute_to_current_span(
            attribute_key=COMMON_ATTRIBUTES['HTTP_ROUTE'],
            attribute_value=str(matched_route))
        tracer.add_attribute_to_current_span(
            attribute_key=COMMON_ATTRIBUTES['HTTP_STATUS_CODE'],
            attribute_value=response.status_code)

    # return original response
    return response
```


![Operation name muncul di Azure AppInsights](https://blob.kodesiana.com/kodesiana-public-assets/posts/2023/operation-name-azure/opreation_name_exists_comp.png)

### 🥳April 2023: `FastAPIMiddleware`

```python
from fastapi import FastAPI
from opencensus.ext.fastapi.fastapi_middleware import FastAPIMiddleware

app = FastAPI(__name__)
app.add_middleware(FastAPIMiddleware)
```

## ✏️ Referensi

1. Microsoft. 2023. [Track incoming requests with OpenCensus Python](https://learn.microsoft.com/en-us/azure/azure-monitor/app/opencensus-python-request#track-fastapi-applications). Diakses 02 Juli 2023.
2. bulkware. 2019. [Help setting cloud_roleName using Azure SDK for Python](https://github.com/Azure/azure-sdk-for-python/issues/6103). Diakses 02 Juli 2023.
3. Microsoft. 2018. [ContextTagKeys.bond ApplicationInsights-dotnet](https://github.com/Microsoft/ApplicationInsights-dotnet/blob/39a5ef23d834777eefdd72149de705a016eb06b0/Schema/PublicSchema/ContextTagKeys.bond#L93). Diakses 02 Juli 2023.
4. Microsoft. 2023. [__init__.py opencensus-python](https://github.com/census-instrumentation/opencensus-python/blob/3a2d8dfe1db4e0129dc691c35901a0d12127afc1/contrib/opencensus-ext-azure/opencensus/ext/azure/trace_exporter/__init__.py#L45). Diakses 02 Juli 2023.
5. NixBiks dan gkocjan. 2021. [Integration with fastapi](https://github.com/census-instrumentation/opencensus-python/issues/1020). Diakses 02 Juli 2023.
6. ikait. 2023. [fastapi_middleware.py opencensus-python](https://github.com/census-instrumentation/opencensus-python/blob/3a2d8dfe1db4e0129dc691c35901a0d12127afc1/contrib/opencensus-ext-fastapi/opencensus/ext/fastapi/fastapi_middleware.py#L55). Diakses 02 Juli 2023.
7. Microsoft. 2023. [Update documentation about opencensus fastapi plugin](https://github.com/MicrosoftDocs/azure-docs/commit/4c54e112db7debc468e32dd01df7b0bfa8a0633e). Diakses 02 Juli 2023.
