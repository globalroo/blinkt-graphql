// Basic GraphQL Server to connect App and Blinkt!

const { ApolloServer, gql } = require("apollo-server");
const { Blinkt } = require("blinkt-kit");
const { rainbow } = require("./rainbow");

const blinkt = new Blinkt({ clearOnExit: true });

// TODO: Acquire current 'state'of Blinkt if it's been controlled from elsewhere.
// i.e. Read from the device itself

const mapPixel = (pixel, id) => {
  const [red, green, blue, brightness] = pixel;
  const on = red !== 0 || green !== 0 || blue !== 0;
  return {
    id,
    on,
    color: {
      red,
      green,
      blue
    },
    brightness: (brightness / 31).toFixed(1)
  };
};

const mapBlinkt = pixels => pixels.map(mapPixel);
const getPixels = () => mapBlinkt(blinkt.getAll());

const typeDefs = gql`
  type Color {
    red: Int
    green: Int
    blue: Int
  }

  type Pixel {
    id: Int
    on: Boolean
    color: Color
    brightness: Float
  }

  type BlinktStatus {
    ok: Boolean
  }

  enum BlinktMode {
    RAINBOW
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    pixels: [Pixel]
  }
  type Mutation {
    setPixel(id: Int, red: Int, green: Int, blue: Int, brightness: Float): Pixel
    setAll(red: Int, green: Int, blue: Int, brightness: Float): [Pixel]
    setBrightness(id: Int, brightness: Float): [Pixel]
    setMode(mode: BlinktMode): BlinktStatus
    reset: [Pixel]
  }
`;

let cleanUpMode;

const resolvers = {
  Query: {
    pixels: () => getPixels()
  },
  Mutation: {
    setPixel: (_, args) => {
      const { id, red, green, blue, brightness } = args;
      blinkt.setPixel({ pixel: id, r: red, g: green, b: blue, brightness });
      blinkt.show();
      return getPixels()[id];
    },
    setAll: (_, args) => {
      const { red, green, blue, brightness } = args;
      blinkt.setAll({ r: red, g: green, b: blue, brightness });
      blinkt.show();
      return getPixels();
    },
    setBrightness: (_, args) => {
      const { id, brightness } = args;
      blinkt.setBrightness({ pixel: id, brightness });
      blinkt.show();
      if (id !== undefined) {
        return [getPixels()[id]];
      }
      return getPixels();
    },
    setMode: (_, args) => {
      const { mode } = args;

      switch (mode) {
        case "RAINBOW":
        default:
          cleanUpMode = rainbow(blinkt);
      }
      return {
        ok: true
      };
    },
    reset: () => {
      if (cleanUpMode) cleanUpMode();
      blinkt.clear();
      return getPixels();
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
