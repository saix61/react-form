import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "schema.graphql",
  documents: "src/gql/*.ts",
  generates: {
    "src/generated/types.ts": {
      plugins: ["typescript"],
    },
  },
};

export default config;
