window.onload=loadpage();
//window.addEventListener('load', loadpage, false );

function loadpage()
{
  var pageurl=window.location.href;

  if(pageurl.toLowerCase().indexOf("producttype")>0)
  {
    if(pageurl.toLowerCase().indexOf("acceptui")>0)
    {
      AcceptUI();
    }
    else if(pageurl.toLowerCase().indexOf("accepthosted")>0)
    {
       if(pageurl.toLowerCase().indexOf("customerid")>0)
       {
         var id = getParameterByName('customerid',window.location.href);
         
       }
       validateID(id);
         AcceptHosted();
    }
    if(pageurl.toLowerCase().indexOf("acceptcustomer")>0)
    {
      AcceptCustomer();
    }
  }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function validateID(id){
   var xhr = new XMLHttpRequest();
   xhr.open('GET', 'http://10.173.126.164:800/api/values');
   xhr.onload = function() {
    if (xhr.status === 200) {
        alert(xhr.responseText);
        document.getElementById("send_hptoken").submit();
        document.getElementById("load_payment").style.display = "block";
    }
    else {
        alert('Request failed ' + xhr.status);
    }
  };
  xhr.send();
}

function AcceptUI(){
   document.getElementById("btnAcceptUI").click();
}

function AcceptHosted(){
   
}

function AcceptCustomer(){
}

function responseHandler(response) {
  if (response.messages.resultCode === "Error") {
        alert("Ooops! Error");
  } 
  else {
        alert("It worked!");
        alert("Token Received");
        alert(response.opaqueData.dataDescriptor);
        alert(response.opaqueData.dataValue);
  }
}
