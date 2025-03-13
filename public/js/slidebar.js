/* Set the width of the side navigation to 250px and the right margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
    document.getElementById("overlay").style.display = "block"; // แสดง overlay
}
  
/* Set the width of the side navigation to 0 and the right margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.getElementById("overlay").style.display = "none"; // ซ่อน overlay
}