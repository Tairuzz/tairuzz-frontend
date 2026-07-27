{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "xmla/tables"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
