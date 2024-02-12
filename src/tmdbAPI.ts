import 'dotenv/config';
import { AugmentedRequest, CacheOptions, RESTDataSource } from "@apollo/datasource-rest";
import { ValueOrPromise } from "@apollo/datasource-rest/dist/RESTDataSource";

type TIME_WINDOW_OPTION = "day" | "week";
type MediaType = "movie" | "tv";

class tmdbAPI extends RESTDataSource {
    override baseURL = 'https://api.themoviedb.org/3/'
    authToken = process.env.API_TOKEN;

    protected willSendRequest(path: string, requestOpts: AugmentedRequest<CacheOptions>): ValueOrPromise<void> {

        requestOpts.headers['Authorization'] = `Bearer ${this.authToken}`
        // requestOpts.headers['Content-Type'] = `application/json`;
    }

    async getTrendingMedia(timeWindow: TIME_WINDOW_OPTION){
        const data = await this.get(`trending/all/${timeWindow}?language=en-US`);
        return data.results.filter((a) => a.media_type === 'movie' || a.media_type === 'tv');
    }

    async getMediaWithKeyword(keyword: string, type: MediaType, page: number = 1){
        const data = await this.get(`search/${type}?query=${keyword}&language=en-US&page=${page}`);
        if(data.results){
            data.results = data.results.map((a) => ({ ...a, media_type: type}));
        }
        return data;
    }

    async getMovieDetail(id: number){
        const moviePromise = this.get(`movie/${id}?language=en-US`);
        const creditsPromise = this.get(`movie/${id}/credits?language=en-US`);
        const keywordsPromise = this.get(`movie/${id}/keywords`)

        try{
            const [movieData, creditsData, keywordsData] = await Promise.all([moviePromise, creditsPromise, keywordsPromise]);

            const { cast, crew } = creditsData;
    
            const { keywords } = keywordsData;
    
    
            movieData.casts = cast.slice(0, 9);
            movieData.directors = crew.filter((a) => a.job === "Director").map((a) => a.name);
            movieData.genres = movieData.genres.map((a) => a.name)
            movieData.keywords = keywords.map((a) => a.name)
            return movieData;
        } catch (error) {
            console.error(error);
        }
    }
    
    async getTvDetail(id: number){
        const tvPromise = this.get(`tv/${id}?language=en-US`);
        const creditsPromise = this.get(`tv/${id}/aggregate_credits?language=en-US`);
        const keywordsPromise = this.get(`tv/${id}/keywords`)

        try{
            const [tvData, creditsData, keywordsData] = await Promise.all([tvPromise, creditsPromise, keywordsPromise]);

            const { cast } = creditsData;
    
            const { results } = keywordsData;

            const updatedCast = cast.slice(0,9).map((castObj) => {
                const roles = [];
                for(let role of castObj.roles){
                    roles.push(role.character);
                }

                return { ...castObj, character: roles.length > 0 ? roles.join(", ") : ""};
            })

            tvData.casts = updatedCast.slice(0, 9);
            tvData.genres = tvData.genres.map((a) => a.name)
            tvData.keywords = results.map((a) => a.name)
            return tvData;
        } catch (error) {
            console.error(error);
        }
    }

    async getPopularMedia(type: MediaType){
        const data = await this.get(`${type}/popular?language=en-US`);
        if(data.results){
            data.results = data.results.map((a) => ({ ...a, media_type: type}));
        }
        return data.results;
    }
    
}

export default tmdbAPI;