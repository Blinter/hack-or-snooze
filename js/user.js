"use strict";
let currentUser;
 const favoriteStory = (evt) => {
    console.debug("favoriteStory", evt);
    evt.preventDefault();
    updateUIOnUserLogin();
    $signupForm.trigger("reset");
}
const login = async(evt) => {
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
const addStoryFromForm = async(evt) => {
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
const updateUserFromForm = async(evt) => {
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
const signup = async(evt) => {
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
const logout = (evt) => {
    console.debug("logout", evt);
    localStorage.clear();
    location.reload();
}
$navLogOut.on("click", logout);
const checkForRememberedUser = async() => {
    console.debug("checkForRememberedUser");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (!token || !username) return false;
    currentUser = await User.loginViaStoredCredentials(token, username);
}
const saveUserCredentialsInLocalStorage = () => {
    console.debug("saveUserCredentialsInLocalStorage");
    if (!currentUser)
        return;
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
}
const updateUIOnUserLogin = () => {
    console.debug("updateUIOnUserLogin");
    putStoriesOnPage();
    updateNavOnLogin();
}