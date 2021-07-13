//initializing join and create buttons for animated layout of home page
const slidePage= $(".intro");
const joinPage= $(".join");
const createFirst= $(".create-1");
const createSecond= $(".create-2");
const joinFirst= $(".join-1");
const joinSecond= $(".join-2");
const joinThird= $(".join-3");
const copyButton= $(".copy");
const backButton= $(".back");
const reqdMsg= $(".required-msg");

//taking user info from inputs
let joinName= $("#username-1");
let createName= $("#username-2");
let meetTitle= $("#title");
let joinCode= $("#code-1");
let createCode= $("#code-2");

reqdMsg.hide();
backButton.hide();

//Home page form animated layout functioning
joinFirst.click(function(){
    joinPage.css("opacity", "1");
    slidePage.css("margin-left", "-25%");
    backButton.show();
})

joinSecond.click(function(e){
    if( joinName.val() == "" || joinCode.val() == ""){     //check if fields are empty
        e.preventDefault();
        reqdMsg.show();
    }
    else{
        localStorage.setItem("userName", joinName.val().trim());
        localStorage.setItem("joinExistingRoomCode", joinCode.val());
    }
})

joinThird.click(function(){
    localStorage.setItem("userName", createName.val().trim());
    localStorage.setItem("createMeetTitle", meetTitle.val().trim());
    localStorage.setItem("createdRoomCode", createCode.val());
})

createFirst.click(function(){
    slidePage.css("margin-left", "-50%");
    backButton.show();
})

createSecond.click(function(e){
    if( createName.val() != "" && meetTitle.val() != ""){     //check if fields are not empty
        e.preventDefault();
        slidePage.css("margin-left", "-75%");
    }
    else{
        reqdMsg.show();
    }
})

//copying meet code
copyButton.click(function(e){
    e.preventDefault();
    createCode.select();
    document.execCommand("copy");
})

//going back button
backButton.click(function(e){
    e.preventDefault();
    reqdMsg.hide();
    if(slidePage.css("margin-left") == "-500px"){
        slidePage.css("margin-left", "0");
        joinPage.css("opacity", "0");
        backButton.hide();
    }
    else if(slidePage.css("margin-left")== "-1000px"){
        slidePage.css("margin-left", "0");
        backButton.hide();
    }
    else if(slidePage.css("margin-left")== "-1500px"){
        slidePage.css("margin-left", "-50%");
    }
})





