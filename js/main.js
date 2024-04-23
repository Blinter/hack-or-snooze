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
function hidePageComponents() {
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
async function start() {
    console.debug("start");
    if (!currentUser)
        currentUser = { displayType: "" };
    activatePageLink();
    await checkForRememberedUser();
    await getAndShowStoriesOnStart();
    if (currentUser && currentUser.loginToken)
        updateUIOnUserLogin();
}
function activatePageLink() {
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
$(start);