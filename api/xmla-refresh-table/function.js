{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "xmla/refresh-table"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
