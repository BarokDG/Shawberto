export interface TweetInfo {
  binding_values: null;
  bookmark_count: number;
  conversation_id: string;
  creation_date: string;
  expanded_url: null;
  extended_entities: {
    media: [
      {
        display_url: string;
        expanded_url: string;
        id_str: string;
        indices: number[];
        media_key: string;
        media_url_https: string;
        type: "video" | "photo" | "animated_gif";
        url: string;
        ext_media_availability: {
          status: string;
        };
        features: {
          large: {
            faces: [
              {
                x: number;
                y: number;
                h: number;
                w: number;
              }
            ];
          };
          medium: {
            faces: [
              {
                x: number;
                y: number;
                h: number;
                w: number;
              }
            ];
          };
          small: {
            faces: [
              {
                x: number;
                y: number;
                h: number;
                w: number;
              }
            ];
          };
          orig: {
            faces: [
              {
                x: number;
                y: number;
                h: number;
                w: number;
              }
            ];
          };
        };
        sizes: {
          large: {
            h: number;
            w: number;
            resize: string;
          };
          medium: {
            h: number;
            w: number;
            resize: string;
          };
          small: {
            h: number;
            w: number;
            resize: string;
          };
          thumb: {
            h: number;
            w: number;
            resize: string;
          };
        };
        original_info: {
          height: number;
          width: number;
          focus_rects: [
            {
              x: number;
              y: number;
              w: number;
              h: number;
            }
          ];
        };
        video_info: {
          aspect_ratio: number[];
          duration_millis: number;
          variants: Array<{
            bitrate: number;
            content_type: string;
            url: string;
          }>;
        };
      }
    ];
  };
  favorite_count: number;
  in_reply_to_status_id: null;
  language: string;
  media_url?: string[] | null;
  quote_count: number;
  quoted_status_id: null;
  reply_count: number;
  retweet_count: number;
  retweet_status: null;
  retweet_tweet_id: null;
  retweet: false;
  source: string;
  text: string;
  timestamp: number;
  tweet_id: string;
  user: {
    bot: false;
    category: null;
    creation_date: string;
    default_profile_image: false;
    default_profile: true;
    description: string;
    external_url: string;
    favourites_count: number;
    follower_count: number;
    following_count: number;
    has_nft_avatar: false;
    is_blue_verified: true;
    is_private: null;
    is_verified: false;
    listed_count: number;
    location: string;
    name: string;
    number_of_tweets: number;
    profile_banner_url: string;
    profile_pic_url: string;
    timestamp: number;
    user_id: string;
    username: string;
  };
  video_url?: string | null;
  video_view_count: null;
  views: number;
}
