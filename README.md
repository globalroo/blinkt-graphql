# blinkt-graphql

_Disclaimer_: Work in progress

Maps blinkt-kit to a basic GraphQL server (localhost:4000)

```sh
node index.js
```

## Examples

```gql
mutation reset {
  reset {
    id,
    color {
      red
      green
      blue
    }
  }
}

mutation setMode {
  setMode(mode: RAINBOW) {
      ok
  }
}

mutation setBrightness {
  setBrightness(brightness: 0.1) {
    id
    on
    brightness
    color {
      red
      green
      blue
    }
  }
}

mutation setPixel {
  setPixel(id: 0, red: 255, green: 0, brightness: 0.1) {
    id
    on
    brightness
    color {
      red
      green
      blue
    }
  }
}

mutation setAll {
  setAll(green: 100) {
    id
    on
    brightness
    color {
      red
      green
      blue
    }
  }
}

query getAll {
  pixels {
    id
    on
    color {
      red
      green
      blue
    }
    brightness
  }
}

``` 
