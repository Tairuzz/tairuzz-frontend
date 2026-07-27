{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "xmla/refresh-dataset"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
