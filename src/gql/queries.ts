import { gql } from "@apollo/client";

export const GET_DATA_QUERY = gql`
  query {
    applicantIndividualCompanyPositions {
      data {
        id
        name
      }
    }
    applicantIndividualCompanyRelations {
      data {
        id
        name
      }
    }
  }
`;
