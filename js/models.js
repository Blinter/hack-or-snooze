"use strict";
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";
class StoryList {
    constructor(stories) {
        this.stories = stories;
    }
    static getStories = async () => new StoryList(await axios({
        url: `${BASE_URL}/stories`,
        method: "GET",
        params: (currentUser ? {
            token: currentUser.loginToken || '',
        } : {})
    }).then(response =>
        response.data.stories.map(story => new Story(story))
    ).catch(e => console.error(e)));
    static addStory = async (user, newStory) => await axios({
        url: `${BASE_URL}/stories`,
        method: "POST",
        data: {
            story: {
                author: newStory.author,
                title: newStory.title,
                url: newStory.url
            },
            token: user.loginToken || '',
        }
    }).then(response => {
        storyList.stories.unshift(new Story(response.data.story));
        user.ownStories.unshift(new Story(response.data.story));
        return response.data.story;
    }).catch(exception => {
        console.error(exception);
        return null;
    });
}
class Story {
    constructor({
        storyId = self.crypto.randomUUID(),
        title,
        author,
        url,
        username = currentUser.username || '',
        createdAt = new Date().toISOString(),
        displayType = "",
    }) {
        this.storyId = storyId;
        this.title = title;
        this.author = author;
        this.url = url;
        this.username = username;
        this.createdAt = createdAt;
        this.displayType = displayType;
        if (url[url.length - 1] === '/')
            this.getHostName = url.slice(0, url.length - 1);
        this.getHostName = url.replace("https://", "").replace("http://", "").replace("www.", "");
    };
}
class User {
    constructor({
        username,
        name,
        createdAt = new Date().toISOString(),
        favorites = [],
        ownStories = []
    }, token) {
        this.username = username;
        this.name = name;
        this.createdAt = createdAt;
        this.favorites = favorites.map(s => new Story(s));
        this.ownStories = ownStories.map(s => new Story(s));
        this.loginToken = token;
    }
    static deleteStory = async (userObj, selectedStoryId) => {
        if (!userObj || !userObj.loginToken)
            return;
        await axios({
            url: `${BASE_URL}/stories/${selectedStoryId}`,
            method: "DELETE",
            data: { storyId: selectedStoryId, token: userObj.loginToken, }
        }).then(response => {
            storyList.stories = storyList.stories.filter(s => s.storyId !== selectedStoryId);
            userObj.ownStories = userObj.ownStories.filter(s => s.storyId !== selectedStoryId);
            userObj.favorites = userObj.favorites.filter(s => s.storyId !== selectedStoryId);
        }).catch(e => console.error(e));
    };
    static toggleFavoriteStory = async (userObj, storyId) => {
        if (!userObj ||
            !userObj.loginToken ||
            !userObj.favorites ||
            !storyList.stories.some(s => s.storyId === storyId))
            return;
        await axios({
            url: `${BASE_URL}/users/${userObj.username}/favorites/${storyId}`,
            method: !userObj.favorites.some(s => s.storyId === storyId) ?
                "POST" : "DELETE",
            data: { token: userObj.loginToken, }
        }).then(response => {
            userObj.favorites = response.data.user.favorites.map(s => new Story(s));
        }).catch(e => console.error(e));
    };
    static updateStory = async (userObj, currentStory) => {
        if (!userObj || !userObj.loginToken)
            return;
        if (!currentStory.url.slice(0, 4).includes('http')) {
            alert("URL not accepted!");
            return;
        }
        await axios({
            url: `${BASE_URL}/stories/${currentStory.storyId}`,
            method: "PATCH",
            data: {
                story: {
                    author: currentStory.author,
                    title: currentStory.title,
                    url: currentStory.url
                },
                token: userObj.loginToken,
            }
        }).then(response => {
            const newStory = new Story(response.data.story);
            storyList.stories.forEach((s, i, a) => {
                if (s.storyId === currentStory.storyId)
                    a[i] = newStory;
            })
            userObj.ownStories.forEach((s, i, a) => {
                if (s.storyId === currentStory.storyId)
                    a[i] = newStory;
            });
            userObj.favorites.forEach((s, i, a) => {
                if (s.storyId === currentStory.storyId)
                    a[i] = newStory;
            });
        }).catch(e => console.error(e));
    };
    static updateUser = async (userObj, { name, password }) => {
        if (!userObj || !userObj.loginToken)
            return;
        if ((name === '' || name === undefined) &&
            (password === '' || password === undefined)) {
            alert("Edit User: Both fields empty! No Change.");
            return;
        }
        let inputData = {};
        if (name !== '' && name !== undefined && name !== userObj.name)
            inputData.name = name;
        if (password !== '' && password !== undefined)
            inputData.password = password;
        console.log(inputData);
        if (!inputData.name && !inputData.password) {
            alert("No change detected.");
            return;
        }
        await axios({
            url: `${BASE_URL}/users/${userObj.username}`,
            method: "PATCH",
            data: {
                token: userObj.loginToken,
                user: inputData
            }
        }).then(response => {
            alert(response.statusText);
            currentUser = { ...response.data.user, loginToken: userObj.loginToken };
            userObj = { ...response.data.user, loginToken: userObj.loginToken };
        }).catch(e => console.error(e));
    };
    static signup = async (username, password, name) => await axios({
        url: `${BASE_URL}/signup`,
        method: "POST",
        data: { user: { username: username, password: password, name: name } },
    }).then(response => new User({
        username: response.data.user.username,
        name: response.data.user.name,
        createdAt: response.data.user.createdAt,
        favorites: response.data.user.favorites,
        ownStories: response.data.user.stories
    }, response.data.token)
    ).catch(e => {
        if (e.response.data.error.status === 409)
            alert(e.response.data.error.title + ": " + e.response.data.error.message);
    });
    static login = async (username, password) => await axios({
        url: `${BASE_URL}/login`,
        method: "POST",
        data: { user: { username: username, password: password } },
    }).then(response => {
        return new User({
            username: response.data.user.username,
            name: response.data.user.name,
            createdAt: response.data.user.createdAt,
            favorites: response.data.user.favorites,
            ownStories: response.data.user.stories
        }, response.data.token)
    }
    ).catch(e => {
        if (e.response.data.error.status)
            alert(e.response.data.error.title + ": " + e.response.data.error.message);
    });
    static loginViaStoredCredentials = async (token, username) => await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token }
    }).then(response => {
        return new User({
            username: response.data.user.username,
            name: response.data.user.name,
            createdAt: response.data.user.createdAt,
            favorites: response.data.user.favorites,
            ownStories: response.data.user.stories
        }, token)
    }).catch(e => {
        console.error("loginViaStoredCredentials failed", e);
        return null;
    });
}