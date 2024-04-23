"use strict";
const navAllStories = (evt) => {
    console.debug("navAllStories", evt);
    currentUser.displayType = "";
    activatePageLink();
    hidePageComponents();
    putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);
const navSubmitNewStory = (evt) => {
    console.debug("navSubmitNewStory", evt);
    if (!currentUser)
        return;
    currentUser.displayType = "submit";
    activatePageLink();
    hidePageComponents();
    $addStoryForm.show();
}
$body.on("click", "#nav-submit", navSubmitNewStory);
const navEditStory = (evt, storyToEdit) => {
    console.debug("navEditStory", evt);
    if (!currentUser)
        return;
    $editStoryForm.off("submit");
    currentUser.displayType = "my stories";
    activatePageLink();
    hidePageComponents();
    $editStoryForm.show();
    $("#editstory-title").val(storyToEdit.title);
    $("#editstory-author").val(storyToEdit.author);
    $("#editstory-url").val(storyToEdit.url);
    $editStoryForm.on("submit", { storyToEdit }, updateStoryFromForm);
}
const navEditUser = (evt) => {
    console.debug("navEditUser", evt);
    if (!currentUser)
        return;
    $editUserForm.off("submit");
    currentUser.displayType = "edituser";
    activatePageLink();
    hidePageComponents();
    $editUserForm.show();
    $editUserForm.children("h4").empty();
    $editUserForm.children("h4")
        .append("Editing User ")
        .append($("<i>").text(currentUser.username));
    $("#edituser-name").val(currentUser.name);
    $editUserForm.on("submit", updateUserFromForm);
}
$navUserProfile.on("click", navEditUser);
const navToggleOnFavorites = (evt) => {
    console.debug("navToggleOnFavorites", evt);
    if (!currentUser)
        return;
    currentUser.displayType = "favorites";
    activatePageLink();
    hidePageComponents();
    putStoriesOnPage();
}
$body.on("click", "#nav-favorites", navToggleOnFavorites);
const navToggleOnMyStories = (evt) => {
    console.debug("navToggleOnMyStories", evt);
    if (!currentUser)
        return;
    currentUser.displayType = "my stories";
    activatePageLink();
    hidePageComponents();
    putStoriesOnPage();
}
$body.on("click", "#nav-stories", navToggleOnMyStories);
const navLoginClick = (evt) => {
    console.debug("navLoginClick", evt);
    currentUser = { displayType: "login" };
    activatePageLink();
    hidePageComponents();
    $loginForm.show();
    $signupForm.show();
}
$navLogin.on("click", navLoginClick);
const updateNavOnLogin = () => {
    console.debug("updateNavOnLogin");
    $(".main-nav-links").show();
    currentUser.displayType = "";
    activatePageLink();
    $loginForm.hide();
    $signupForm.hide();
    $navLogin.hide();
    $navLogOut.show();
    $navUserProfile.text(`${currentUser.name}`).show();
    $navMemberBar.show();
}