// @flow
import * as _ from "lodash";

const data = require("./data");

export type Picture = {
    uri: string,
    preview: string
};

export type Profile = {
    picture: Picture,
    name: string,
    outline: string
};

export type Post = {
    uid: string,
    id: string,
    likes: number,
    comments: number,
    timestamp: number,
    text: string,
    picture: Picture
};

export type Comment = {
    id: string,
    text: string,
    uid: string,
    timestamp: number
};

export default class APIStore {

    static me(): string {
        return "09003f2b-a0f5-4b6a-b66a-d3446df71728";
    }

    static profile(uid: string): Profile {
        return data.users[uid];
    }

    static posts(): Post[] {
        return data.posts;
    }

    static addPost(post: Post) {
        data.posts.push(post);
    }

    static comments(post: string): Comment[] {
        if (!data.comments[post]) {
            data.comments[post] = [];
        }
        return _.sortBy(data.comments[post], ["timestamp"]).reverse();
    }

    static addComment(post: string, comment: Comment) {
        if (!data.comments[post]) {
            data.comments[post] = [];
        }
        data.comments[post].push(comment);
    }
}
