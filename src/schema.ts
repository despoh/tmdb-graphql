
const typeDefs = `#graphql
    type Movie {
        id: ID!
        title: String!
        overview: String
        posterPath: String
        backdropPath: String
        voteAverage: String
        releaseDate: String      
    }

    type TV {
        id: ID!
        title: String!
        overview: String
        posterPath: String
        backdropPath: String
        voteAverage: String
        releaseDate: String
    }

    type Cast {
        name: String!
        profile_path: String
        character: String!
    }

    type MovieDetail{
        id: ID!
        title: String!
        overview: String!
        posterPath: String
        backdropPath: String
        voteAverage: String!
        releaseDate: String!
        tagline: String
        genres: [String]
        status: String
        originalLanguage: String
        budget: String
        revenue: String
        casts: [Cast]
        duration: String
        directors: [String]
        keywords: [String]
    }

    type TvDetail{
        id: ID!
        title: String!
        overview: String!
        posterPath: String
        backdropPath: String
        voteAverage: String!
        releaseDate: String!
        tagline: String
        genres: [String]
        status: String
        originalLanguage: String
        creator: [String]
        casts: [Cast]
        keywords: [String]
        networkLogos: [String] 
        type: String
    }

    type SearchResult {
        page: Int!
        totalPages: Int!
        totalResults: Int!
        data: [Media!]!
    }

    union Media = Movie | TV
    union MediaDetail = MovieDetail | TvDetail

    type Query {
        trendingMedia(timeWindow: String): [Media!]!
        popularMedia(type: String): [Media!]!
        movieDetail(id: Int): MovieDetail!
        tvDetail(id: Int): TvDetail!
        search(keyword: String, type: String, pageNumber: Int): SearchResult
    }
`

export default typeDefs;