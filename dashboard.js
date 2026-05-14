<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">
<title>Agent Dashboard</title>

<link rel="stylesheet" href="dashboard.css">

</head>

<body>

<header class="topBar">

<div class="logo">
Agent Tools
</div>

<div class="profileSection">

<img id="agentAvatar" class="avatar">

<div class="profileInfo">
<div id="agentName">Agent</div>
<div id="agentEmail"></div>
</div>

<button id="profileBtn">☰</button>

<div id="profileDropdown" class="dropdown">
<a href="profile.html">Edit Profile</a>
<button id="logoutBtn">Logout</button>
</div>

</div>

</header>



<!-- TAB MENU -->

<div class="tabs">

<button class="tabBtn" onclick="openTab('tools')">Tools</button>
<button class="tabBtn" onclick="openTab('agents')">Agent Directory</button>
<button class="tabBtn" onclick="openTab('resources')">Resources</button>

</div>



<div class="mainContainer">


<!-- TOOLS TAB -->

<div id="tools" class="tabContent">

<div class="tool">

<h3>Internal Tools</h3>

<p>Your tools will appear here.</p>

</div>

</div>



<!-- AGENT DIRECTORY -->

<div id="agents" class="tabContent">

<div class="tool">

<h3>Agent Directory</h3>

<div id="agentDirectory">

<div id="agentGrid"></div>

</div>

</div>

</div>



<!-- RESOURCES TAB -->

<div id="resources" class="tabContent">

<div class="tool">

<h3>Resources</h3>

<p>Add scripts, training docs, or links here.</p>

</div>

</div>


</div>



<script>

function openTab(tabId){

let tabs=document.querySelectorAll(".tabContent");

tabs.forEach(tab=>{
tab.style.display="none";
});

document.getElementById(tabId).style.display="block";

}

// default tab
openTab("tools");

</script>


<script type="module" src="dashboard.js"></script>

</body>
</html>
