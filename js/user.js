"use strict";
let currentUser;
async function favoriteStory(evt) {
    console.debug("favoriteStory", evt);
    evt.preventDefault();
    updateUIOnUserLogin();
    $signupForm.trigger("reset");
}
async function login(evt) {
    evt.preventDefault();
    console.debug("login", evt);
    currentUser = await User.login(
        $("#login-username").val(),
        $("#login-password").val());
    $loginForm.trigger("reset");
    saveUserCredentialsInLocalStorage();
    if (currentUser) {
        updateUIOnUserLogin();
        $navMemberBar.show();
    }
}
$loginForm.on("submit", login);
async function addStoryFromForm(evt) {
    evt.preventDefault();
    console.debug("addStoryFromForm", evt);
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
$addStoryForm.on("submit", addStoryFromForm);
async function updateUserFromForm(evt) {
    evt.preventDefault();
    console.debug("updateUserFromForm", evt);
    await User.updateUser(currentUser, {
        name: $("#edituser-name").val(),
        password: $("#edituser-password").val()
    }).then(() => {
        $editUserForm.off("submit");
        $($editUserForm).trigger("reset");
        $($editUserForm).hide();
        updateUIOnUserLogin();
    }).catch(exception => console.error(exception));
}
async function signup(evt) {
    evt.preventDefault();
    console.debug("signup", evt);
    currentUser = await User.signup(
        $("#signup-username").val(),
        $("#signup-password").val(),
        $("#signup-name").val());
    $signupForm.trigger("reset");
    saveUserCredentialsInLocalStorage();
    if (currentUser) {
        updateUIOnUserLogin();
        $navMemberBar.show();
    }
}
$signupForm.on("submit", signup);
function logout(evt) {
    console.debug("logout", evt);
    localStorage.clear();
    location.reload();
}
$navLogOut.on("click", logout);
async function checkForRememberedUser() {
    console.debug("checkForRememberedUser");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token || !username) return false;
    currentUser = await User.loginViaStoredCredentials(token, username);
}
function saveUserCredentialsInLocalStorage() {
    console.debug("saveUserCredentialsInLocalStorage");
    if (!currentUser)
        return;
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
}
function updateUIOnUserLogin() {
    console.debug("updateUIOnUserLogin");
    putStoriesOnPage();
    updateNavOnLogin();
}