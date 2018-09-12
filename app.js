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
       //if(pageurl.toLowerCase().indexOf("customerid")>0)
       //{
        // var id = getParameterByName('customerid',window.location.href);
         
       //}
       //validateID(id);
         AcceptHosted();
    }
    else if(pageurl.toLowerCase().indexOf("acceptcustomer")>0)
    {
      activeCont="acceptcustomer";
      //AcceptCustomer();
    }
  }
}


function AcceptUI()
{
     
    var form=document.getElementById("paymentForm");
     form.setAttribute("action",globalVars.pageUrl);

     var ele=document.getElementById("btnAcceptUI");
     ele.setAttribute("data-apiLoginID",globalVars.apiLoginID);
     ele.setAttribute("data-clientKey",globalVars.clientKey);
     //ele.click();
     
      /*setTimeout(function(){ 
             var d = document.getElementById("AcceptUIContainer");
              d.className += "show";
       },200);*/ 
}

function AcceptHosted()
{

  // Ajax call for API to get token
   $.ajax({
    type: 'GET',  
    url:globalVars.getHostedTokenUrl,
    data:{
      apiLoginId: globalVars.apiLoginID, 
      apiTransactionKey: globalVars.apiTransactionKey,
      iFrameCommunicatorUrl:"https://10.173.192.248:5008/iframeCommunicator.html"
    },
    contentType: "application/json; charset=utf-8",
    success: function (data, textStatus, jqXHR) {
      if(data.status)
      {
           document.getElementById("hostedtoken").value=data.value;
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
     var accountType = document.getElementById("accountType");

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
        if(accountType.value=="")  
         accountType.classList.add("error");
        else
        {
          accountType.classList.remove("error");
          accountType.classList.add("success");
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
       bankData.accountType = document.getElementById('accountType').value;
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
   // document.getElementById("accountType").value = "";
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
    $frame = null;
    switch(parentFrame){
     // case "manage"     : $frame = $("#load_profile");break;
      //case "addPayment"   : $frame = $("#add_payment");break;
     // case "addShipping"  : $frame = $("#add_shipping");break;
     // case "editPayment"  : $frame = $("#edit_payment");break;
      //case "editShipping" : $frame = $("#edit_shipping");break;
      case "payment"    : $frame = $("#load_payment");break;
    }

    switch(params['action']){
      case "resizeWindow"   :   //if( parentFrame== "manage" && parseInt(params['height'])<1150) params['height']=1150;
                    if( parentFrame== "payment" && parseInt(params['height'])<1000) 
                      {
                        params['height']=500;
                        params['width']=400;
                      }
                    
                    //if(parentFrame=="addShipping" && $(window).width() > 1021) params['height']= 350;
                    $frame.outerHeight(parseInt(params['height']));
                    $frame.outerWidth(parseInt(params['width']));
                    break;

      case "successfulSave"   :   $('#myModal').modal('hide'); location.reload(false); break;

      case "cancel"       :   
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

      case "transactResponse" :   sessionStorage.removeItem("HPTokenTime");
                    $('#HostedPayment').attr('src','about:blank');
                    var transResponse = JSON.parse(params['response']);
                    $("#HPConfirmation p").html("<strong><b> Success.. !! </b></strong> <br><br> Your payment of <b>$"+transResponse.totalAmount+"</b> for <b>"+transResponse.orderDescription+"</b> has been Processed Successfully on <b>"+transResponse.dateTime+"</b>.<br><br>Generated Order Invoice Number is :  <b>"+transResponse.orderInvoiceNumber+"</b><br><br> Happy Shopping with us ..");
                    $("#HPConfirmation p b").css({"font-size":"22px", "color":"green"});
                    $("#HPConfirmation").modal("toggle");
    }
  }
