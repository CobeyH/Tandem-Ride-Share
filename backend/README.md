# Backend

## Running

In the root of the project run:

```bash
./gradlew backend:run
```

### Setup notes:

In order to enable firebase authentication the environment variable `GOOGLE_APPLICATION_CREDENTIALS`
or `FIREBASE_CONFIG` must be set to either a path to a service account key json or a service account key json.
See [Initialize the SDK](https://firebase.google.com/docs/admin/setup#initialize-sdk) in firebases docs for information
on how to obtain a service account key.

## Testing

In the root of the project run:

```bash
./gradlew backend:test
```