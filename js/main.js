"use strict";
const $body = $("body");
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $addStoryForm = $("#addstory-form");
const $editStoryForm = $("#editstory-form");
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $editUserForm = $("#edituser-form");

const $navMemberBar = $(".navbar-userlinks");

const $navSubmitStory = $("#nav-submit");
const $navFavorites = $("#nav-favorites");
const $navStories = $("#nav-stories");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const hidePageComponents = () => {
    [
        $allStoriesList,
        $loginForm,
        $signupForm,
        $addStoryForm,
        $editStoryForm,
        $editUserForm,
    ].forEach(c => c.hide());
    activatePageLink();
}
const start = async() => {
    console.debug("start");
    if (!currentUser)
        currentUser = { displayType: "" };
    activatePageLink();
    await checkForRememberedUser();
    await getAndShowStoriesOnStart();
    if (currentUser && currentUser.loginToken)
        updateUIOnUserLogin();
}
const activatePageLink = () => {
    if (!currentUser)
        return;
    switch (currentUser.displayType) {
        case "favorites":
            $("#nav-all").css("text-decoration", "");
            $("#nav-login").css("text-decoration", "");
            $("#nav-user-profile").css("text-decoration", "");
            $("#nav-submit").css("text-decoration", "");
            $("#nav-stories").css("text-decoration", "");
            $("#nav-favorites").css("text-decoration", "underline");
            break;
        case "my stories":
            $("#nav-all").css("text-decoration", "");
            $("#nav-login").css("text-decoration", "");
            $("#nav-user-profile").css("text-decoration", "");
            $("#nav-submit").css("text-decoration", "");
            $("#nav-stories").css("text-decoration", "underline");
            $("#nav-favorites").css("text-decoration", "");
            break;
        case "submit":
            $("#nav-all").css("text-decoration", "");
            $("#nav-login").css("text-decoration", "");
            $("#nav-user-profile").css("text-decoration", "");
            $("#nav-submit").css("text-decoration", "underline");
            $("#nav-stories").css("text-decoration", "");
            $("#nav-favorites").css("text-decoration", "");
            break;
        case "edituser":
            $("#nav-all").css("text-decoration", "");
            $("#nav-login").css("text-decoration", "");
            $("#nav-user-profile").css("text-decoration", "underline");
            $("#nav-submit").css("text-decoration", "");
            $("#nav-stories").css("text-decoration", "");
            $("#nav-favorites").css("text-decoration", "");
            break;
        case "login":
            $("#nav-all").css("text-decoration", "");
            $("#nav-login").css("text-decoration", "underline");
            $("#nav-user-profile").css("text-decoration", "");
            $("#nav-submit").css("text-decoration", "");
            $("#nav-stories").css("text-decoration", "");
            $("#nav-favorites").css("text-decoration", "");
            break;
        default:
            $("#nav-all").css("text-decoration", "underline");
            $("#nav-login").css("text-decoration", "");
            $("#nav-user-profile").css("text-decoration", "");
            $("#nav-submit").css("text-decoration", "");
            $("#nav-stories").css("text-decoration", "");
            $("#nav-favorites").css("text-decoration", "");
            break;
    }
}
console.log("HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose");
$(start);