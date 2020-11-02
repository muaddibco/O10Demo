# O10Demo
## Launching server-side
For running project just launch docker-compose:

```
$ docker-compose up -d 
```

Check if portal, gateway and node are up and running and are connected to each other:
```
$ curl --location --request GET 'http://localhost:5003/api/Diagnostic'
```

There should be returned response as follows:
```
[
	{
		"context": "Portal",
		"infoType": "Version",
		"message": "1.0.0.0"
	},
	{
		"context": "Gateway",
		"infoType": "Version",
		"message": "1.0.0.0"
	},
	{
		"context": "Gateway",
		"infoType": "UpdaterConnectivity",
		"message": "Succeeded"
	},
	{
		"context": "Node",
		"infoType": "Version",
		"message": "1.0.0.0"
	}
]
```

## Launching front-end
Go to /O10DemoApp/O10DemoApp folder.
1. run `npm install`
1. Run `ng serve` for a dev server. 
1. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
