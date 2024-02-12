const resolvers = {
    Media: {
        __resolveType(obj){
            if(obj.media_type === 'movie'){
                return "Movie"
            }

            if(obj.media_type === 'tv'){
                return "TV"
            }
        }
    },
    Movie: {
        title: (root) => root.title,
        posterPath: (root) => root.poster_path,
        backdropPath: (root) => root.backdrop_path,
        voteAverage: (root) => root.vote_average,
        releaseDate: (root) => root.release_date,

    },
    TV: {
        title: (root) => root.name,
        posterPath: (root) => root.poster_path,
        backdropPath: (root) => root.backdrop_path,
        voteAverage: (root) => root.vote_average,
        releaseDate: (root) => root.first_air_date,
    },
    SearchResult: {
        data: (root) => root.results,
        totalPages: (root) => root.total_pages,
        totalResults: (root) => root.total_results,
    },
    MovieDetail: {
        title: (root) => root.title,
        posterPath: (root) => root.poster_path,
        backdropPath: (root) => root.backdrop_path,
        voteAverage: (root) => root.vote_average,
        releaseDate: (root) => root.release_date,
        originalLanguage: (root) => root.original_language,
        duration: (root) => root.runtime,
    },
    TvDetail: {
        title: (root) => root.name,
        posterPath: (root) => root.poster_path,
        backdropPath: (root) => root.backdrop_path,
        voteAverage: (root) => root.vote_average,
        releaseDate: (root) => root.first_air_date,
        originalLanguage: (root) => root.original_language,
        creator: (root) => root.created_by.map((a) => a.name),
        networkLogos: (root) => root.networks.map((a) => a.logo_path)
    },
    Query: {
        trendingMedia: async (_source, _args, { dataSources }) => {
            return dataSources.tmdbAPI.getTrendingMedia(_args.timeWindow);
        },
        popularMedia: async (_source, _args, { dataSources }) => {
            return dataSources.tmdbAPI.getPopularMedia(_args.type);
        },
        movieDetail: async (_source, _args, { dataSources }) => {
            return dataSources.tmdbAPI.getMovieDetail(_args.id);
        },
        tvDetail: async (_source, _args, { dataSources }) => {
            return dataSources.tmdbAPI.getTvDetail(_args.id);
        },
        search: async (_source, _args, { dataSources }) => {
            return dataSources.tmdbAPI.getMediaWithKeyword(_args.keyword, _args.type, _args.pageNumber);
        }
    }
}

export default resolvers;