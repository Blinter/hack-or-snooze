"use strict";
let storyList;
async function getAndShowStoriesOnStart() {
    storyList = await StoryList.getStories();
    $storiesLoadingMsg.remove();
    putStoriesOnPage();
}
const generateDeleteButton = storyId =>
    currentUser && currentUser.ownStories && currentUser.ownStories.some(s => s.storyId === storyId) ?
        `` : '';
const generateFavoriteButton = storyId =>
    currentUser && currentUser.favorites && currentUser.favorites.some(s => s.storyId === storyId) ?
        `<i id="toggleFavorite" class="fa-solid fa-star"></i>` :
        `<i id="toggleFavorite" class="fa-regular fa-star"></i>`;
const generateAuthorOrSelf = storyUsername =>
    !currentUser || storyUsername !== currentUser.username ?
        `<small class="story-user">posted by ${storyUsername}</small>` :
        `<small class="story-user-edit">posted by <i>you</i>  </small >`;
const generateControls = storyUsername =>
    currentUser && storyUsername === currentUser.username ?
        ` <i class="fa-solid fa-pen-to-square" id="edit-story"></i>` +
        ` <i class="fa-sharp fa-solid fa-x" id="deleteStory" ></i> ` :
        '';
const generateStoryMarkup = (story) =>
    $(`<li id="${story.storyId}">
        ${generateFavoriteButton(story.storyId)}
        <a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
        ${generateControls(story.username)}
        <small class="story-hostname">(${story.getHostName})</small>
        <div class="story-author">by ${story.author}</div>
        ${generateAuthorOrSelf(story.username)}
      </li>`);
const emptyGenerateSuggestion = userObj => {
    if (!userObj)
        return '';
    switch (userObj.displayType) {
        case "favorites":
            return `<small>Empty! Please click the Star next to a story to add to this list!</small>`;
        case "my stories":
            return `<small>Empty! Please submit a new story to fill up this list!</small>`;
        default:
            return `<small>Please login or register and submit a new story to fill up list!</small>`;
    }
}
const provideStories = userObj => {
    if (!userObj)
        return storyList.stories;
    switch (userObj.displayType) {
        case "favorites":
            return userObj.favorites || [];
        case "my stories":
            return userObj.ownStories || [];
        default:
            return storyList.stories || [];
    }
};
function putStoriesOnPage() {
    //console.debug("putStoriesOnPage");
    $allStoriesList.empty();
    const stories = provideStories(currentUser);
    for (let story of stories) {
        $allStoriesList.append(generateStoryMarkup(story));
        if (currentUser)
            $("#" + story.storyId).children("i#toggleFavorite").on("click", (e) =>
                toggleFavoriteStory(e, story.storyId));
        if (currentUser && story.username === currentUser.username) {
            $("#" + story.storyId).children("i#deleteStory").on("click", () => {
                User.deleteStory(currentUser, story.storyId)
                    .then(() => {
                        $("#" + story.storyId).remove();
                        if (currentUser.displayType === "my stories" &&
                            !storyList.stories.some(s => s.username === currentUser.username))
                            $allStoriesList.append(emptyGenerateSuggestion(currentUser));
                        else if (currentUser.displayType === "favorites" &&
                            currentUser.favorites.length === 0)
                            $allStoriesList.append(emptyGenerateSuggestion(currentUser));
                        else if (storyList.stories.length === 0)
                            $allStoriesList.append(emptyGenerateSuggestion(currentUser));

                    }).catch(e => console.error(e));
            });
            $("#" + story.storyId).children("i#edit-story").on("click", (e) =>
                navEditStory(e, story));
        }
    }
    if (stories.length === 0)
        $allStoriesList.append(emptyGenerateSuggestion(currentUser));
    $allStoriesList.show();
}
async function toggleFavoriteStory(evt, currentStoryId) {
    evt.preventDefault();
    //console.debug("toggleFavoriteStory", evt);
    if (!currentUser || !currentUser.favorites)
        return;
    await User.toggleFavoriteStory(currentUser, currentStoryId)
        .then(() => {
            //console.debug("Toggle Favorite Completed");
            $(evt.target).attr({
                class: !currentUser.favorites.some(s => s.storyId === currentStoryId) ?
                    "fa-regular fa-star" :
                    "fa-solid fa-star"
            });
            if (currentUser.displayType === "favorites") {
                $(evt.target).closest("li").remove();
                if (currentUser.favorites.length === 0)
                    $allStoriesList.append(emptyGenerateSuggestion(currentUser));
            }
        }).catch(e => console.error(e));
}
async function addStoryFromForm(evt) {
    evt.preventDefault();
    //console.debug("addStoryFromForm", evt);
    await StoryList.addStory(currentUser,
        new Story({
            author: $("#story-author").val(),
            title: $("#story-title").val(),
            url: $("#story-url").val()
        })).then(() => {
            $($addStoryForm).trigger("reset");
            $($addStoryForm).hide();
            putStoriesOnPage();
        }).catch(exception => console.error(exception));
}
async function updateStoryFromForm(evt) {
    evt.preventDefault();
    //console.debug("updateStoryFromForm", evt);
    await User.updateStory(currentUser,
        new Story({
            storyId: evt.data.storyToEdit.storyId,
            author: $("#editstory-author").val(),
            title: $("#editstory-title").val(),
            url: $("#editstory-url").val(),
        })).then(response => {
            $editStoryForm.off("submit");
            putStoriesOnPage();
            $("#" + evt.data.storyToEdit.storyId).children("a").text($("#editstory-title").val());
            $("#" + evt.data.storyToEdit.storyId).children("a").attr({ url: $("#editstory-url").val() });
            $($editStoryForm).trigger("reset");
            $($editStoryForm).hide();
        }).catch(exception => console.error(exception));
}