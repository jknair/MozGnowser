/*
#**** BEGIN LICENSE BLOCK *****
# Version: MPL 1.1/GPL 2.0/LGPL 2.1
# 
# The contents of this file are subject to the Mozilla Public License
# Version 1.1 (the "License"); you may not use this file except in
# compliance with the License. You may obtain a copy of the License at
# http://www.mozilla.org/MPL/
# 
# Software distributed under the License is distributed on an "AS IS"
# basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
# License for the specific language governing rights and limitations
# under the License.
# 
# The Original Code is MozGnowser code.
# 
# The Initial Developer of the Original Code is Jayakrishnan B Nair
# Portions created by the Initial Developer are Copyright (C) 2009-2010.
# All Rights Reserved.
# 
# Contributor(s):
#   Jayakrishnan B Nair <jayakrishnan.bk.nair@gmail.com>
#   Sai Srivatsan R Iyengar
#   Ridima Borkar
#   Foram Dalal
# 
# Alternatively, the contents of this file may be used under the terms of
# either the GNU General Public License Version 2 or later (the "GPL"), or
# the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
# in which case the provisions of the GPL or the LGPL are applicable instead
# of those above. If you wish to allow use of your version of this file only
# under the terms of either the GPL or the LGPL, and not to allow others to
# use your version of this file under the terms of the MPL, indicate your
# decision by deleting the provisions above and replace them with the notice
# and other provisions required by the GPL or the LGPL. If you do not delete
# the provisions above, a recipient may use your version of this file under
# the terms of any one of the MPL, the GPL or the LGPL.
# 
#**** END LICENSE BLOCK *****
*/

var pyt;
var user;
var htmldocument=document;
var addnid;
top.SVGclick = svgClick;
var  availablefns;
top.Deo=doo;
top.debug=Debug;
var addthread;
var svgThread;
try
    {  
	var Jst =  Components.Constructor('@gnowledge.org/jsgnowmoz;1','JSGnowMoz');
	var jst =new Jst();
    }
catch (ex)
    {
	alert("init:: error: " + ex);
    }
try
    {   // Connection to the Python interface in the Components directory of the Extension
	pyt = Components.classes['@gnowledge.org/gnowmoz;1'].createInstance(Components.interfaces.GnowMoz);

    }
catch (ex)
    {
	alert("init:: error: " + ex);
    }

/* $(document).ready(function(){
    $('#themes').themeswitcher();
  });
*/
function doo(){alert("hello");}
netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
/*const MEDIATOR_CONTRACTID="@mozilla.org/appshell/window-mediator;1";
const nsIWindowMediator=Components.interfaces.nsIWindowMediator;
var windowManager=
    Components.classes[MEDIATOR_CONTRACTID].getService(nsIWindowMediator);
try {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      mainWindow = windowManager.getMostRecentWindow("navigator:browser");
    }
    catch(e) {
      alert(e);
      }*/
//window.innerHeight=983;
//window.innerWidth=1579;
//alert(window.innerHeight+ "   "+window.innerWidth);

var workingThread = function(type,arr) {
    
    this.type=type;
    this.arr= arr;
    
};

workingThread.prototype = {
    run: function() {
	try {
	    // This is where the working thread does its processing work.
	    if(this.type=="svg")
		{
		    
		    pyt.getsvg(this.arr[0]);
		    var Arr=[this.type];
		    main.dispatch(new mainThread(Arr),svgThread.DISPATCH_NORMAL);
		}
	    if(this.type=="add-options")
		{
		    Arr=[this.type];
		    pyt.getrel();
		    Arr.push(pyt.result);
		    pyt.getattribute();
		    Arr.push(pyt.result);
		    pyt.getdep();
		    Arr.push(pyt.result);
		    main.dispatch(new mainThread(Arr),addthread.DISPATCH_NORMAL);
		}
	    if(this.type=="search")
		{
		   pyt.gnowqlSearch(this.arr[0],this.arr[1]);   
		   Arr=[this.type,pyt.result]
		   
		   main.dispatch(new mainThread(Arr),searchThread.DISPATCH_NORMAL);
		}

	    // When it's done, call back to the main thread to let it know
	    // we're finished.
	    
	    
	} catch(err) {
	    Components.utils.reportError(err);
	}
  },
    
    QueryInterface: function(iid) {
	if (iid.equals(Components.interfaces.nsIRunnable) ||
	    iid.equals(Components.interfaces.nsISupports)) {
            return this;
	}
	throw Components.results.NS_ERROR_NO_INTERFACE;
  }
};

var mainThread = function(arr) {
    this.arr = arr;
};

mainThread.prototype = {
    run: function() {
	try {
	    
	    // This is where we react to the completion of the working thread.
	    if(this.arr[0]=="svg"){loadsvg();}
	    if(this.arr[0]=="add-options")
		{
		    var tw1=JSON.parse(this.arr[1]);
		    var tw2=JSON.parse(this.arr[2]);
		    var tw3=JSON.parse(this.arr[3]);
		     for(var i=0;i<tw1.length;i++)
			$("#nbh-add-select-rel").append('<option>'+tw1[i]+'</option>');
		    for(var i=0;i<tw2.length;i++)
			$("#nbh-add-select-att").append('<option>'+tw2[i]+'</option>');
		    for(var i=0;i<tw3.length;i++){
			$("#nbh-add-select-dep").append('<option>'+tw3[i]+'</option>');}
		}
	    if(this.arr[0]=="search"){searchDOM(this.arr[1]);}
	} catch(err) {
      Components.utils.reportError(err);
	}
    },
    
    QueryInterface: function(iid) {
	if (iid.equals(Components.interfaces.nsIRunnable) ||
	    iid.equals(Components.interfaces.nsISupports)) {
            return this;
	}
	throw Components.results.NS_ERROR_NO_INTERFACE;
    }
};
mgr = Components.classes["@mozilla.org/thread-manager;1"];
pool =Components.classes["@mozilla.org/thread-pool;1"].getService();
var main = Components.classes["@mozilla.org/thread-manager;1"].getService().mainThread;
pool.threadLimit=10;
pool.idleThreadLimit=10;
pool.idleThreadTimeout=1000000000;

//alert(pool.idleThreadLimit + "  "+ pool.idleThreadTimeout+"  "+pool.threadLimit); 







function Debug(msg)
{
    alert(msg);
}

jst.initialise(top);




/*
  alert(jst.hello());
*/


$(function()
  {
      
      $("#search-value").qtip(
			      {
				  content:$("#search-tip").html(),		  
				      position: {    corner: {target: 'leftBottom',tooltip: 'topRight'}},
				      style: {tip:'topRight',color:'black',name:'blue',width:400}
			      });
      
 
      
      $("#help").qtip(
		      {
			  content:$("#startup-info").html(),
			      position: {    corner: {target: 'bottomMiddle',tooltip: 'topLeft'}},
			      style: {tip:'topLeft',color:'black',name:'blue',width:700}
		      });
      $("#gnowql-shell-link").button({ icons: {        secondary: 'ui-icon-gear'     }  });
      $("#help").button({ icons: {        secondary: 'ui-icon-help'     }  });
      $("#SEARCH").button({ icons: {     primary: 'ui-icon-search'     }  });
      
  });

function dologin()  //to authenticate the username and password 
{
    document.getElementById("login-form").style.display='inline';
    document.getElementById("result-table").style.display='none';
    $("#proxy").accordion({collapsible: true,autoHeight:true,active:false});
    
    
    globalKeys();
    //pop up dialog for enry of login details    
    
    $("#login-form").dialog({
	    autoOpen: true,
		title: 'MozGnowser Login',
		height:400,
		width: 450,
		modal: true,
		show: 'clip',
		hide: 'clip',
		buttons: 
	    {
		'Login': function()
		    {
			logincheck();
		    }
	    }
	    
	});
    
    
    
    document.getElementById("login").focus();
    
}

function logincheck() 
{
    user=document.getElementById("login").value;
    passw=document.getElementById("pass").value;
    url=document.getElementById("url").value;
    pyt.usrpass=user+":"+passw;
    pyt.url=url;
    var proxy= $("#proxy").accordion("option","active");
    
    if( proxy.toString()==0 )
	{
	    
	    pyt.proxyenabled="true";
	    pyt.proxyuser = $("#proxy-username").val();
	    pyt.proxypass = $("#proxy-password").val();
	    pyt.proxyurl = $("#proxy-url").val()+':'+ $("#proxy-port").val();
	    if(pyt.proxyuser!="" && pyt.proxyport!="" && pyt.proxyurl!="" && pyt.proxypass !="")
		{
		    
		    pyt.login(); //calls the python method login()
		}
	    else
		{
		    
		    pyt.result="false";
		    document.getElementById("login-error").style.visibility='visible';
		    $('#login-error').show('pulsate',500);
		}
	}
    else
	{
	    
	    pyt.proxyenabled="false";
	    pyt.login();  //calls the python method login()			     	
	}
    
    
    if(pyt.result=="true")
	{
	    $("#login-form").css("display",'none');
	    document.getElementById("startup-info").style.display='inline';
	    document.getElementById("layout-header").style.display='inline';
	   
	    
	    /* $("#nbh-add-select-rel-body").empty().append($("#nbh-add-select-rel").html());
	       $("#nbh-add-select-att-body").empty().append($("#nbh-add-select-att").html());
	       $("#nbh-add-select-dep-body").empty().append($("#nbh-add-select-dep").html());
	    */
	    //	document.getElementById("addbody").style.display='inline';
	    //$("#nbh-add-body").accordion({collapsible: false,autoheight:true,fillspace:true});
	    $("#login-form").dialog('close');
	    $("#login-form").empty();
		bindKEYS();
	}
    else
	{
	    
	    document.getElementById("login-error").style.visibility='visible';
	    $('#login-error').show('pulsate',500);
	}
    
    addthread = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(0);
    addthread.dispatch(new workingThread("add-options",["0"]),addthread.DISPATCH_NORMAL);

    
}


// Search funtion to which inputs can be probable nid of the node or use specific search using "ssid:" as a constraint in the search box

function GnowqlSearch()
{
    
    document.getElementById("startup-info").style.display='none';
    search_val=document.getElementById("search-value").value;
    var type = $("#search-type").val();
    searchThread = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(0);
    searchThread.dispatch(new workingThread("search",[search_val,type]),searchThread.DISPATCH_NORMAL);
    $('#search-loading').html('<img src="chrome://gnowmoz/content/css/loading.gif" style="float:right"></img><label style="width:20%;float:right"><b>SEARCHING</b></label>');
}
function searchDOM(result)
{
    
    if(result!="empty")
	{
	    var mydata=JSON.parse(result);
	    
	    document.getElementById("result-table").style.display='inline';
	    $('#result-area').hide('clip',500);
	    $('#result-area').empty();
	    var rdib= document.createElement("div");
	    rdib.setAttribute("id","result");
	    $('#result-area').append(rdib);		
	    for(var x=0;x< mydata.length; x++ )
		{
		    var twt = mydata[x];
		    
		    var dib1= document.createElement("h3");
		    var dib2= document.createElement("a");
		    dib2.setAttribute("href","#");
		    var str=decodeURIComponent( twt.nid );
		    dib2.appendChild(document.createTextNode(str.replace(/_/g," ") ));
		    $(dib1).append(dib2);
		    var dib3= document.createElement("div");
		    dib2.setAttribute("id",twt.ssid);
		    dib2.setAttribute("class","result-values");
		    dib3.setAttribute("id","div-"+twt.ssid);
		    $(dib3).html("NID : "+twt.nid+"<br>"+"SSID : "+twt.ssid+"<br>NODETYPE : "+twt.nodetype+"<br>");
		    $(rdib).append(dib1);
		    $(rdib).append(dib3);
		}
	    
	    getneighbourhood(mydata[0].ssid);
	    $(".result-values").bind('click', function() {getneighbourhood(this.id);});
	    $("#result-area").show('clip',1000);
	    $("#result-area").height(2*screen.height/3);
	    $("#search-loading").empty();
	}
    else
	{	
	    $('#result-area').hide('clip',500);
	    $('#result-area').empty();
	    var rdib= document.createElement("div");
	    rdib.setAttribute("style","font-size:20");
	    rdib.appendChild(document.createTextNode("NO RESULTS !!!"));
	    $('#result-area').append(rdib);
	    $('#result-area').show('pulsate',1500);
	     $("#search-loading").empty();
	}
    
    
}

function getneighbourhood(id)
{	
    
    $('#nbh-svg').empty();
  
    $('#nbh-info').empty();
    
    //python method to create the svg at the server end and getting the required url 
    
    svgThread = Components.classes["@mozilla.org/thread-manager;1"].getService().newThread(0);
    svgThread.dispatch(new workingThread("svg",[id]),svgThread.DISPATCH_NORMAL);
    $('#nbh-svg').html('<label style="width:20%;float:left"><b>LOADING SVG</b></label><img src="chrome://gnowmoz/content/css/loading.gif" style="float:left"></img>');
    

    //displaying the neighbourhood and other information of the nid selected 
    
    pyt.getnbh(id);
    var twt=JSON.parse(pyt.result);
    // alert(pyt.rendered_nbh);
    /* $('#div-'+id).html( "<b>STATUS                          : </b>" + twt[0].status + 
			"<br><b>INID                        : </b>" + twt[0].inid + 
			"<br><b>SSID                        : </b>" + twt[0].ssid + 
			"<br><b>FIELDS CHANGED              : </b>" + twt[0].fieldschanged + 
			"<br><b>CHANGETYPE                  : </b>" + twt[0].changetype + 
			"<br><b>NID                         : </b>" + twt[0].nid + 
			"<br><b>NO OF CHANGES               : </b>" + twt[0].noofchanges + 
			"<br><b>NO OF COMMITS               : </b>" + twt[0].noofcommits + 
			"<br><b>NO OF CHANGES AFTER COMMITS : </b>" + twt[0].noofchangesaftercommit + 
			"<br><b>TIMESTAMP                   : </b>" + twt[0].gbtimestamp + 
		        "<br><b>HISTORY                     : </b>" + twt[0].history + "<br>");
    */

    $('#nbh-info').html("<br />RENDERED NBH <br /><br />" + pyt.rendered_nbh );

    $("#result").accordion({collapsible: false,autoHeight:false});//startup accordion for displaying the various results
    
    //creating editable part
    addnid=twt[0].nid;
    $("#nbh-add-nid-rel").val(twt[0].nid);
    $("#nbh-add-nid-att").val(twt[0].nid);
    $("#nbh-add-nid-dep").val(twt[0].nid);
    $("#nbh-add-text-rel").val("");
    $("#nbh-add-text-dep").val("");
    $("#nbh-add-text-att").val("");
    $(".nbh-click").bind('click', 
			 function(){document.getElementById("search-value").value="ssid:"+this.id;GnowqlSearch();
			 });
    
    
    
    $("#nbh-resultinfo").tabs();  // create tabs to display the information in 3 different sections
    $("#nbh-resultinfo").tabs("select",0);
    
    $("#add").accordion({collapsible: true,active:false});
    
    $("#nbh-add").tabs();
    $("#nbh-add").tabs("select",0);
    
}


function loadsvg()
{$('#nbh-svg').empty();
    /* $('#nbh-svg').append('<embed src="chrome://gnowmoz/content/js/autozoomsvg/autozoom.svg" type="image/svg-xml" id="svg-object" style="width:100%;height:100%;border:4px red solid;display:none" ></embed>');
    $("#svg-object").css("display","inline");   
    */
top.keyZOOM = 0;
top.keyPAN= 0;
    var dib2= document.createElement("embed");
    dib2.setAttribute("src","chrome://gnowmoz/content/js/autozoomsvg/autozoom.svg");
    
    dib2.setAttribute( "type","image/svg+xml");
    dib2.setAttribute( "id","svg-object");
    dib2.setAttribute("style","width:100%;height:100%;border:4px red solid");
    //$(dib2).html(pyt.result);
    $('#nbh-svg').prepend(dib2);
    // alert(window.innerHeight+" "+window.innerWidth);

}


//auto complete feature which searches the gnowsys db using the python method and builds a list to the text boxas the user types the propbable nid


$(function() 
  {
      $(".autocomplete").autocomplete(
				      {
					  minLength: 2,
					      source: function (request, response){
					      st=request.term.substring(0,5);
					      $("#search-value").qtip("hide");
					      if(st!= "ssid:")
						  {
						      pyt.gnowqlPossibleSearch(request.term);
						      if(pyt.result != "empty")
							  {
							      var mydata=JSON.parse(pyt.result);
							      response(mydata);		
							  }
						      else response(["NO RESULT "]);
						  }
					      else
						  {
						      
						      st = request.term.substring(5);
						      
						      pyt.searchnid(st.toString());
						      if(pyt.result != "empty")
							  {
							      var mydata=JSON.parse(pyt.result);
							      response([mydata[st]]);		
							  }
						      else response(["SSID SEARCH :NO RESULT "]);
						      
						      
						  }
					  },
					      select : function (event, ui){
					      GnowqlSearch();
					  }
					  
					  
				      });
  });






function svgClick(id)
{
    $("#search-type").val("All");
    document.getElementById("search-value").value="ssid:"+id.toString();
    GnowqlSearch();
}



function add(choice)
{
    
    if(choice=="rel")
	{
	    addnid=$("#nbh-add-text1-rel").val();
	    pred="rt";
	    predicate=document.getElementById("nbh-add-select-rel").value;
	    object0=document.getElementById("nbh-add-text-rel").value;
	}
    if(choice=="att")
	{
	    addnid=$("#nbh-add-text1-att").val();
	    pred="at";
	    predicate=document.getElementById("nbh-add-select-att").value;
	    object0=document.getElementById("nbh-add-text-att").value;
	}
    
    if(choice=="dep")
	{
	    addnid=$("#nbh-add-text1-dep").val();
	    pred="dp";
	    predicate=document.getElementById("nbh-add-select-dep").value;
	    object0=document.getElementById("nbh-add-text-dep").value;
	}
    pyt.searchOptions(object0);
    var twt=JSON.parse(pyt.result);
    
    if(twt.length>1)
	{
	    $("#add-options").empty();
	    document.getElementById("add-options").style.display='inline';
	    
	    
	    $("#add-options").dialog({
		    autoOpen: true,
			title: 'Multiple Choice',
			height:500,
			width: 800,
			
			show: 'clip',
			hide: 'clip',
			buttons: 
		    {
			'Submit': function() 
			    {
				var active=$("#choice").accordion("option","active");
				if(twt[active]=='Create a New Node')
				    {
					$(this).dialog('close');
					pyt.addTriple(addnid,pred,predicate,object0);
					var tw=JSON.parse(pyt.result);
					document.getElementById("search-value").value="ssid:"+tw["new_subject_ssid"];
					GnowqlSearch();
				    }
				else
				    {
					object0=twt[active-1];
					$(this).dialog('close');
					pyt.addTriple(addnid,pred,predicate,object0);
					var tw=JSON.parse(pyt.result);
					document.getElementById("search-value").value="ssid:"+tw["new_subject_ssid"];
					$("#search-type").val("All");
					GnowqlSearch();
				    }
			    }
		    }
		});
	    
	    var rdib= document.createElement("div");
	    rdib.setAttribute("id","choice");
	    $('#add-options').append(rdib);

	    
	    for(var i=0;i<twt.length;i++)
		{
		    
		    
		    var dib1= document.createElement("h3");
		    var dib2= document.createElement("a");
		    dib2.setAttribute("href","#");
		    dib2.setAttribute("style","text-decoration:none");
		    dib2.setAttribute("id","option"+(i+1));
		    dib2.setAttribute("class","add-opt");
		    dib2.appendChild(document.createTextNode(twt[i]));
		    var dib3= document.createElement("div");
		    dib3.setAttribute("style","display:none");
		    $(dib1).append(dib2);
		    $(rdib).append(dib1);
		    $(rdib).append(dib3);
		}
	    
	    $("#choice").accordion();
	    $("#choice").accordion("option", "icons", false);
	    
	    
	}
    
    
    else
	{
	    pyt.addTriple(addnid,pred,predicate,object0);
	    var twt=JSON.parse(pyt.result);
	    $("#search-type").val("All");
	    document.getElementById("search-value").value="ssid:"+twt["new_subject_ssid"];
	    GnowqlSearch();
	}
    
}

function bindKEYS()
{
    $(document).bind('keydown','Ctrl+z',function (evt){top.keyZOOM("in");return false;});
    $(document).bind('keydown','Ctrl+x',function(evt){top.keyZOOM("out");return false;});
    $(document).bind('keydown ','Ctrl+up',function(evt){top.keyPAN(0,-10);return false;});
    $(document).bind('keydown','Ctrl+down',function(evt){top.keyPAN(0,10);return  false;});
    $(document).bind('keydown','Ctrl+left',function(evt){top.keyPAN(-10,0);return false;});
    $(document).bind('keydown','Ctrl+right',function(evt){top.keyPAN(10,0);return false;});
    
}

function globalKeys()
{
    $("#search-value").bind('keydown','return',function (evt){GnowqlSearch();});
    $("#nbh-add-text-rel").bind('keydown','return',function (evt){if($("#nbh-add-text-rel").val()!="")radd();});
    $(".logintext").bind('keydown','return',function (evt){logincheck();});
    $("#gnowql-shell-text").bind('keydown','return',function(evt)
				 {
				     pyt.GnowQLshell($("#gnowql-shell-text").val());
				     availablefns.push($("#gnowql-shell-text").val());
				     
				     $("#gnowql-shell-box").val(pyt.result);
				     $("#gnowql-shell-tree").empty();				       
				     $("#gnowql-shell-tree").jsonviewer({
					     json_name: 'TreeView', // specifies a display name for the JSON object
						 json_data: JSON.parse(pyt.result),   // specifies the JSON object data
						  'inner-padding': '5px', 'outer-padding': '8px'
        });

				 });
}


function gnowqlShell()
{
    
    
    $("#gnowql-shell").dialog({
	    autoOpen: true,
		title: 'GnowQL Shell : Type in the Python commands from the gnowql',
		height:500,
		width: 1000,
		modal: true,
		show: 'clip',
		hide: 'clip',
		buttons: 
	    {
		'Close': function(){$(this).dialog('close');}
	    }
     });
}

$(function() 
  {
  availablefns = ["getAuthUserid(",
		  "manageAddAttributeType(",
		  "manageAddAttribute(",
		  "manageAddObject(",
		  "manageAddObjectType(",
		  "manageAddRelationType(",
		  "manageAddRelation(",
		  "manageAddUser(",
		  "manageAddUserType(",
		  "set_relation(",
		  "setuser(",
		  "setnode(",
		  "updateStructure(",
		  "replaceStructure(",
		  "getlatestVersion(",
		  "getUsernamefronUserId(",
		  "get_inid_from_nid(",
		  "Update(",
		  "Delete(",
		  "setlist(",
		  "setregex(",
		  "addUser(",
		  "addUserSQL(",
		  "getUserId(",
		  "userExists(",
		  "nidExisits(",
		  "getAll(",
		  "get_uid(",
		  "getUsernamefronUserId_list(",
		  "getUserIdfromUsername(",
		  "getlatestssids(",
		  "get_renderednbh(",
		  "get_nbh_renderednbh(",
		  "getNeighbourhood(",
		  "getsnapshots_history_n_version(",
		  "getAllsnapshots(",
		  "getDatatype(",
		  "getAllnbh(",
		  "getRoles(",
		  "getSubjecttypes(",
		  "getSelectionlist(",
		  "getRegex(",
		  "getRestrictions(",
		  "getAttributetypes(",
		  "getRelationtypes(",
		  "getAttributeValues(",
		  "getNodetype(",
		  "getNodetypes(",
		  "getSubtypes(",
		  "getSubtypesCnt(",
		  "getInstances(",
		  "getInstancesCnt(",
		  "getOntologies(",
		  "getAllSubtypes(",
		  "getAllInstances(",
		  "getRelationids(",
		  "updateStatus(",
		  "gettimestamp(",
		  "getPublicIds(",
		  "updatecommit(",
		  "searchNodes(",
		  "search(",
		  "getnids(",
		  "getinids(",
		  "genTriples(",
		  "getCount(",
		  "getSpecificnbh(",
		  "getAuthor(",
		  "updatePasswd(",
		  "getStructure(",
		  "getPortalUrl(",
		  "genNBHImage(",
		  "genDepImage(",
		  "getDatatypes(",
		  "getPossibleRel(",
		  "searchPossibleRel(",
		  "searchPossibleAttr(",
		  "getPossibleAttr(",
		  "getPriorstates(",
		  "getPoststates(",
		  "getFrame(",
		  "getRelFrame(",
		  "getInverseName(",
		  "getInverseNames(",
		  "n3_nbhexport(",
		  "genN3(",
		  "n3_export(",
		  "searchfs(",
		  "n3_schema(",
		  "rdf_import(",
		  "getContributors(",
		  "getModDate(",
		  "triplesKB(",
		  "getRelCnt(",
		  "getusers(",
		  "getroles(",
		  
		  ];
  
  $("#gnowql-shell-text").autocomplete({
	  source: availablefns
	      });
  });
