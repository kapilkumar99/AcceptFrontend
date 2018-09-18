var activeCont="";
window.onload=loadpage();

function loadpage()
{
  var pageurl=window.location.href;
  for (let el of document.querySelectorAll('.productCont')) el.style.display="none";
  if(pageurl.toLowerCase().indexOf("producttype")>0)
  {
    if(pageurl.toLowerCase().indexOf("acceptjs")>0)
    {
        document.getElementById("acceptjs").style.display="block";
        activeCont="acceptjs";
        //Show card information by default
        document.getElementById("rdCard").click();
    }
    else if(pageurl.toLowerCase().indexOf("acceptui")>0)
    {
      activeCont="acceptui";
      document.getElementById("acceptui").style.display="block";
      AcceptUI();
    }
    else if(pageurl.toLowerCase().indexOf("accepthosted")>0)
    {
      activeCont="accepthosted";
       if(pageurl.toLowerCase().indexOf("customerid")>0)
       {
         var id = getParameterByName('customerid',window.location.href.toLowerCase());
          var result= ValidateCustomer(id);
            if(result.valid)
            {
              AcceptHosted(id);
            }
       }
       else
       {
         AcceptHosted('');
       }
    }
    else if(pageurl.toLowerCase().indexOf("acceptcustomer")>0)
    {
      activeCont="acceptcustomer";
      if(pageurl.toLowerCase().indexOf("customerid")>0)
       {
         var id = getParameterByName('customerid',window.location.href);
         //if(document.getElementById("isvalidated").value=="no")
         //{
            var result= ValidateCustomer(id);
            if(result.valid)
            {
              AcceptCustomer(id);
            }
         //}
         //else
         //{
         //   AcceptCustomer(id);
         //}
       }
    }
  }
}

//To get query string parameter value based on name
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function AcceptUI()
{
     
    var form=document.getElementById("paymentForm");
     form.setAttribute("action",globalVars.pageUrl);

     var ele=document.getElementById("btnAcceptUI");
     ele.setAttribute("data-apiLoginID",globalVars.apiLoginID);
     ele.setAttribute("data-clientKey",globalVars.clientKey);
}

function AcceptHosted(id)
{
  var customerId=id;
  // Ajax call for API to get token
   $.ajax({
    type: 'GET',  
    url:globalVars.getHostedTokenUrl,
    data:{
      apiLoginId: globalVars.apiLoginID, 
      apiTransactionKey: globalVars.apiTransactionKey,
      iFrameCommunicatorUrl: globalVars.iFrameCommunicatorUrl,
      customerId: customerId
    },
    contentType: "application/json; charset=utf-8",
    success: function (data, textStatus, jqXHR) {
      if(data.status)
      {
           document.getElementById("hostedtoken").value=data.value;
           document.getElementById("send_hptoken").setAttribute("action",globalVars.hostedFormUrl);
            document.getElementById("send_hptoken").submit();
            document.getElementById("acceptHosted").style.display="block";
            document.getElementById("load_payment").style.display="block";
            
      }
      else
      {
              document.getElementById("noteHS").style.display="none";
              document.getElementById("msgHS").innerHTML ="";
              document.getElementById("msgHS").innerHTML =data.message;
              var element = document.getElementById("alertHS");
              element.classList.remove("alert-success");
              element.classList.add("alert-danger");
              element.style.display="block";
               document.getElementById("acceptHosted").style.display="block";
      }
            
        },
    error: function (jqXHR, textStatus, errorThrown) {
          document.getElementById("msgHS").innerHTML ="";
              document.getElementById("msgHS").innerHTML =textStatus;
              var element = document.getElementById("alertHS");
              element.classList.remove("alert-success");
              element.classList.add("alert-danger");
              element.style.display="block";
    }
  });
}

//to clear the modal dialog window values on reload
function ShowModal()
{
  document.getElementById("txtCustomerId").value = "";
  document.getElementById("invalidCustomer").style.display="none";
}

function Redirect()
{
   document.getElementById("invalidCustomer").style.display="none";
   customerId = document.getElementById("txtCustomerId").value;
   var result=ValidateCustomer(customerId);
   if(result.valid)
   {
      if(result.status)
      {
      window.location.href= "index.html?producttype=acceptcustomer&customerid="+customerId;
      setTimeout(function(){ 
      document.getElementById("isvalidated").value="yes";
       },200);
    }
    else
    {
          document.getElementById("invalidCustomer").style.display="inherit";
            document.getElementById("invalidCustomer").innerHTML=result.message; 
     }
  }
  else
  {
    document.getElementById("invalidCustomer").style.display="inherit";
      document.getElementById("invalidCustomer").innerHTML=result.message;
  }

}

//Validate customer in AcceptCustomer
function ValidateCustomer(id)
{
     var customerId;
  
    //document.getElementById("invalidCustomer").style.display="none";
    //customerId = document.getElementById("txtCustomerId").value;
    customerId=id;
    var result={};
  $.ajax({
     type: 'GET',
     url: globalVars.validateCustomer,
     data:{
      apiLoginId: globalVars.apiLoginID, 
      apiTransactionKey: globalVars.apiTransactionKey,
      customerId: customerId
    },
    async: false,
    contentType: "application/json; charset=utf-8",
    success:function(data,textStatus,jqXHR){
      /*if(data.status == true)
      {
         return true;
      }
      else
      {
          return false;
            
          document.getElementById("invalidCustomer").style.display="inherit";
          document.getElementById("invalidCustomer").innerHTML=data.message; 
      }*/
      result={
        valid:true,
        status:data.status,
        message:data.message
      };
    },
    error:function(data,textStatus,errorThrown){
      
      result={
        valid:false,
        status:false,
        message:textStatus
      };
      //return result;
      //document.getElementById("invalidCustomer").style.display="inherit";
      //document.getElementById("invalidCustomer").innerHTML=data.message;
   
    }
  });
  return result;

}

function AcceptCustomer(id)
{
  var customerId=id;
  // Ajax call for API to get token
   $.ajax({
    type: 'GET',  
    url:globalVars.getCustomerTokenUrl,
    data:{
      apiLoginId: globalVars.apiLoginID, 
      apiTransactionKey: globalVars.apiTransactionKey,
      customerId : customerId,
      iFrameCommunicatorUrl: globalVars.iFrameCommunicatorUrl
    },
    contentType: "application/json; charset=utf-8",
    success: function (data, textStatus, jqXHR) {
      if(data.status)
      {
           document.getElementById("custtoken").value=data.value;
           document.getElementById("send_token").setAttribute("action",globalVars.customerFormUrl);
            document.getElementById("send_token").submit();
            document.getElementById("acceptCustomer").style.display="block";
            document.getElementById("load_profile").style.display="block";
            
      }
      else
      {
              document.getElementById("noteCS").style.display="none";
              document.getElementById("msgCS").innerHTML ="";
              document.getElementById("msgCS").innerHTML =data.message;
              var element = document.getElementById("alertCS");
              element.classList.remove("alert-success");
              element.classList.add("alert-danger");
              element.style.display="block";
              document.getElementById("acceptCustomer").style.display="block";
      }
            
        },
    error: function (jqXHR, textStatus, errorThrown) {
          document.getElementById("msgCS").innerHTML ="";
              document.getElementById("msgHS").innerHTML =textStatus;
              var element = document.getElementById("alertCS");
              element.classList.remove("alert-success");
              element.classList.add("alert-danger");
              element.style.display="block";
    }
  });
}

//On click of radio buttons
function showData(option)
{
  document.getElementById("msg").innerHTML="";
  document.getElementById("alert").style.display="none";
     if(option=="card")
     {
        document.getElementById("bank").style.display="none";
        document.getElementById("card").style.display = "block";
     }
    else{
     document.getElementById("card").style.display = "none";
     document.getElementById("bank").style.display = "block";
    }
  document.getElementById("btns").style.display = "block";
}

//To validate fields in Accept JS form
function validatePaymentFields()
{
  var sel=document.querySelector('input[name="optradio"]:checked').value;
  if(sel=="card")
  {
   var cardNo = document.getElementById("cardNumber");
   var expMonth = document.getElementById("expMonth");
   var expYear = document.getElementById("expYear");

       if(cardNo.value=="") 
         cardNo.classList.add("error");
       else
       {
         cardNo.classList.remove("error");
         cardNo.classList.add("success");
       }
       if(expMonth.value=="")  
         expMonth.classList.add("error");
       else
       {
         expMonth.classList.remove("error");
         expMonth.classList.add("success");
       }
       if(expYear.value=="")  
         expYear.classList.add("error");
       else
       {
          expYear.classList.remove("error");
          expYear.classList.add("success");
       }
   }
   else{
     var accountNumber = document.getElementById("accountNumber");
     var routingNumber = document.getElementById("routingNumber");
     var nameOnAccount = document.getElementById("nameOnAccount");
     //var accountType = document.getElementById("accountType");

        if(accountNumber.value=="")  
          accountNumber.classList.add("error");
       else
       {
         accountNumber.classList.remove("error");
         accountNumber.classList.add("success");
       }
       if(routingNumber.value=="")
         routingNumber.classList.add("error");
       else
       {
        routingNumber.classList.remove("error");
         routingNumber.classList.add("success");
       }
       if(nameOnAccount.value=="")
         nameOnAccount.classList.add("error");
       else
       {
          nameOnAccount.classList.remove("error");
          nameOnAccount.classList.add("success");
       }
       var radios = document.getElementsByName('acntradio');
        var val;
        for (var i = 0, length = radios.length; i < length; i++)
        {
         if (radios[i].checked)
         {
          val=radios[i].value;
          break;
         }
         else{
          val="";
         }
        }

        if(val=="" || val=== null)  
         document.querySelector('input[name="acntradio"]').classList.add("error");
        else
        {
          document.querySelector('input[name="acntradio"]').classList.remove("error");
          document.querySelector('input[name="acntradio"]').classList.add("success");
        }
   }

   var iserror=document.getElementsByClassName("error");
   if(iserror.length>0)
   {
         document.getElementById("msg").innerHTML ="";
         document.getElementById("msg").innerHTML = "Please provide all required fields";
          var element = document.getElementById("alert");
          element.classList.remove("alert-success");
          element.classList.add("alert-danger");
          element.style.display="block";
         return "false";
   }
   else
   {
    return "true";
   }
}

//To restrict inputs to allow only numbers
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//On entering value validate input
function onTextInput(id)
{
   var element = document.getElementById(id);
   if(element.value!="")
   {
     element.classList.remove("error");
     element.classList.add("success");
   }
   else{
    element.classList.remove("success");
     element.classList.add("error");
   }
}

//Send payment information on Pay click in Accept Js
function sendPaymentDataToAnet()
{

  var isvalid=validatePaymentFields();
  if(isvalid=="true")
  {
   var authData = {};
   authData.clientKey = globalVars.clientKey;
   authData.apiLoginID = globalVars.apiLoginID;

    var sel=document.querySelector('input[name="optradio"]:checked').value;
    
    if(sel=="card")
    {
        var cardData={};
        cardData.cardNumber = document.getElementById("cardNumber").value;
        cardData.month = document.getElementById("expMonth").value;
        cardData.year = document.getElementById("expYear").value;
        cardData.cardCode = document.getElementById("cardCode").value;
    }
    else
    {
       var bankData={};
       bankData.accountNumber = document.getElementById('accountNumber').value;
       bankData.routingNumber = document.getElementById('routingNumber').value;
       bankData.nameOnAccount = document.getElementById('nameOnAccount').value;
       bankData.accountType = document.querySelector('input[name="acntradio"]:checked').value;
   }
   var secureData = {};
   secureData.authData = authData;
   if(sel=="card")
    secureData.cardData = cardData;
   else
   secureData.bankData = bankData;

   Accept.dispatchData(secureData, responseHandler);
 }
}

function responseHandler(response) {
    if (response.messages.resultCode === "Error") {
        var i = 0;
        var container= document.getElementById("msg");
        container.innerHTML="";
        var value="";
        var element ;
        var node ;
        document.getElementById("note").style.display="none";
        element = document.createElement("p");
        node = document.createTextNode("Error Details :");
        element.appendChild(node);
        container.appendChild(element);

        while (i < response.messages.message.length) {
          var value=response.messages.message[i].code + ": " +
                response.messages.message[i].text;
            //To add error messages to a div
            element = document.createElement("p");
            node = document.createTextNode(value);
            element.appendChild(node);
            
            container.appendChild(element);
            i = i + 1;
        }
          var msgdiv = document.getElementById("alert");
          msgdiv.classList.remove("alert-success");
          msgdiv.classList.add("alert-danger");
          msgdiv.style.display="block";
    } 
    else {
         if(activeCont=="acceptui")
         {
            document.getElementById("dataDescriptor").value = response.opaqueData.dataDescriptor;
            document.getElementById("dataValue").value = response.opaqueData.dataValue;
            
            var tokenVal=document.getElementById("dataValue").value;
            // Ajax call for API by passing token
              $.ajax({
              type: 'GET',  
              url:globalVars.accpetJsUrl,
              data: {
                apiLoginId: globalVars.apiLoginID, 
                apiTransactionKey: globalVars.apiTransactionKey,
                token: tokenVal

              },
              contentType: "application/json; charset=utf-8",
              success: function (data, textStatus, jqXHR) {
                      document.getElementById("msgUI").innerHTML ="";
                      if(data.status)
                      {
                       document.getElementById("noteUI").style.display="block";
                       document.getElementById("msgUI").innerHTML ="Order confirmation number: "+data.value;
                      }
                      else
                      {
                        document.getElementById("noteUI").style.display="none";
                        document.getElementById("msgUI").innerHTML=data.message;
                      }
                      var element = document.getElementById("alertUI");
                      if(data.status)
                      {
                        element.classList.remove("alert-danger");
                        element.classList.add("alert-success");
                      }
                      else{
                        element.classList.remove("alert-success");
                        element.classList.add("alert-danger");
                      }
                      element.style.display="block";
                  },
              error: function (jqXHR, textStatus, errorThrown) {
                    document.getElementById("msgUI").innerHTML ="";
                    document.getElementById("msgUI").innerHTML =textStatus;
                    var element = document.getElementById("alertUI");
                    element.classList.remove("alert-success");
                    element.classList.add("alert-danger");
                    element.style.display="block";
                  }
            });

         }
         else{
          paymentFormUpdate(response.opaqueData);
         }
    }
}

//Reset fields on submit
function paymentFormUpdate(opaqueData) {
    document.getElementById("dataDescriptor").value = opaqueData.dataDescriptor;
    document.getElementById("dataValue").value = opaqueData.dataValue;

    // If using your own form to collect the sensitive data from the customer,
    // blank out the fields before submitting them to your server.
    document.getElementById("cardNumber").value = "";
    document.getElementById("expMonth").value = "";
    document.getElementById("expYear").value = "";
    document.getElementById("cardCode").value = "";
    document.getElementById("accountNumber").value = "";
    document.getElementById("routingNumber").value = "";
    document.getElementById("nameOnAccount").value = "";
     var rds = document.getElementsByName("acntradio");
   for(var i=0;i<rds.length;i++)
      rds[i].checked = false;
    var element=document.getElementsByClassName('error');
    while (element.length)
    element[0].classList.remove("error");
    
    element=document.getElementsByClassName('success');
    while (element.length)
    element[0].classList.remove("success");
    
    document.getElementById("alert").style.display = "none";

   var tokenVal=document.getElementById("dataValue").value;

   // Ajax call for API by passing token
   $.ajax({
    type: 'GET',  
    url:globalVars.accpetJsUrl,
    data: {
      apiLoginId: globalVars.apiLoginID, 
      apiTransactionKey: globalVars.apiTransactionKey,
      token: tokenVal
    },
    contentType: "application/json; charset=utf-8",
    success: function (data, textStatus, jqXHR) {
     
            document.getElementById("msg").innerHTML ="";
            if(data.status)
            {
             document.getElementById("note").style.display="block";
             document.getElementById("msg").innerHTML ="Order confirmation number: "+data.value;
            }
            else
            {
              document.getElementById("note").style.display="none";
              document.getElementById("msg").innerHTML=data.message;
            }
            var element = document.getElementById("alert");
            if(data.status)
            {
              element.classList.remove("alert-danger");
              element.classList.add("alert-success");
            }
            else{
              element.classList.remove("alert-success");
              element.classList.add("alert-danger");
            }
            element.style.display="block";
        },
    error: function (jqXHR, textStatus, errorThrown) {
          document.getElementById("msg").innerHTML ="";
          document.getElementById("msg").innerHTML =textStatus;
          var element = document.getElementById("alert");
          element.classList.remove("alert-success");
          element.classList.add("alert-danger");
          element.style.display="block";
        }
  });
}
window.CommunicationHandler = {};
function parseQueryString(str) {
    var vars = [];
    var arr = str.split('&');
    var pair;
    for (var i = 0; i < arr.length; i++) {
      pair = arr[i].split('=');
      vars[pair[0]] = unescape(pair[1]);
    }
    return vars;
  }
CommunicationHandler.onReceiveCommunication = function (argument) {
    params = parseQueryString(argument.qstr)
    parentFrame = argument.parent.split('/')[4];
   // console.log(params);
    //console.log(parentFrame);
    //alert(params['height']);
    frame = null;
    switch(parentFrame){
      case "manage"     : frame = document.getElementById("load_profile");break;
      //case "addPayment"   : $frame = $("#add_payment");break;
     // case "addShipping"  : $frame = $("#add_shipping");break;
     // case "editPayment"  : $frame = $("#edit_payment");break;
      //case "editShipping" : $frame = $("#edit_shipping");break;
      case "payment"    : frame = document.getElementById("load_payment");break;
    }

    switch(params['action']){
      case "resizeWindow"   :   if( parentFrame== "manage" && parseInt(params['height'])<1150)
                         {
                        params['height']=600;
                        params['width']=800;
                      }
                    if( parentFrame== "payment" && parseInt(params['height'])<1000) 
                      {
                        params['height']=500;
                        params['width']=400;
                      }
                    
                    //if(parentFrame=="addShipping" && $(window).width() > 1021) params['height']= 350;
                    frame.height=parseInt(params['height']);
                    frame.width=parseInt(params['width']);
                    break;

      case "successfulSave"   :   $('#myModal').modal('hide'); location.reload(false); break;

      case "cancel"       : 
      alert("cancel");  
                    var currTime = sessionStorage.getItem("lastTokenTime");
                    if (currTime === null || (Date.now()-currTime)/60000 > 15){
                      location.reload(true);
                      onLoad = true;
                    }
                    switch(parentFrame){
                   // case "addPayment"   : $("#send_token").attr({"action":baseUrl+"addPayment","target":"add_payment"}).submit(); $("#add_payment").hide(); break; 
                   // case "addShipping"  : $("#send_token").attr({"action":baseUrl+"addShipping","target":"add_shipping"}).submit(); $("#add_shipping").hide(); $('#myModal').modal('toggle'); break;
                   // case "manage"       : $("#send_token").attr({"action":baseUrl+"manage","target":"load_profile" }).submit(); break;
                   // case "editPayment"  : $("#payment").show(); $("#addPayDiv").show(); break; 
                   // case "editShipping" : $('#myModal').modal('toggle'); $("#shipping").show(); $("#addShipDiv").show(); break;
                    case "payment"    : sessionStorage.removeItem("HPTokenTime"); $('#HostedPayment').attr('src','about:blank'); break; 
                    }
                    break;

      case "transactResponse" :   
      alert("transact");
    }
  }
