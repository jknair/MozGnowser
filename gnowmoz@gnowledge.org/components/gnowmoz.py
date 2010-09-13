#!/usr/bin/env python

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

import sys
import xpcom
from xpcom import components, verbose
import nsdom
import xmlrpclib
import json
from xpcom import components, ServerException, nsError
from xpcom.server import WrapObject
import httplib
import urllib2
from xml.dom.minidom import parseString
import base64
import threading

class FuncThread(threading.Thread):
    def __init__(self, target, *args):
        self._target = target
        self._args = args
        threading.Thread.__init__(self)

    def run(self):
        self._target(*self._args)

class ProxiedTransport(xmlrpclib.Transport):
    def set_proxy(self, proxy,puser_pass):
        self.proxy = proxy
	self.puser_pass = puser_pass
    def make_connection(self, host):
        self.realhost = host
        h = httplib.HTTP(self.proxy)
        return h
    def send_request(self, connection, handler, request_body):
        connection.putrequest("POST", 'http://%s%s' % (self.realhost, handler))
    def send_host(self, connection, host):
        connection.putheader('Host', self.realhost)
	connection.putheader('User-agent', self.user_agent)
	# Check is proxy username and password is set
	if len(self.puser_pass.strip()) != 0:
		connection.putheader('Proxy-authorization','Basic '+self.puser_pass)

class gnowmoz:
    _com_interfaces_ = components.interfaces.GnowMoz
    _reg_clsid_ = "{c4527cab-1c64-4740-a65a-d00ef4532f2e}"
    _reg_contractid_ = "@gnowledge.org/gnowmoz;1"
    _reg_desc_ = "Gnowsys Mozilla Extension"
    s=xmlrpclib.ServerProxy('http://sandboxat.gnowledge.org/gnowql')
    servurl='http://sandboxat.gnowledge.org/gnowql'
    js = components.classes['@gnowledge.org/jsgnowmoz;1'].createInstance(components.interfaces.JSGnowMoz)
    ALT=components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(components.interfaces.nsIPromptService)
    p = ProxiedTransport()	
    def __init__(self):
	self.usrpass="abba:abba"
	self.result="false"
	gnowmoz.p= ProxiedTransport()
	pass

    def login(self):
        #st=gnowmoz.js.hello()
	try:
            st=self.url.split("://")
	    if self.proxyenabled=="true":
                proxyUsername = self.proxyuser
                proxyPassword = self.proxypass
                puser_pass = base64.encodestring('%s:%s' % (proxyUsername, proxyPassword)).strip()
                gnowmoz.p.set_proxy(self.proxyurl, puser_pass)
                gnowmoz.s=xmlrpclib.ServerProxy('http://'+self.usrpass+'@'+st[1],transport=gnowmoz.p)
            else:
                gnowmoz.s=xmlrpclib.ServerProxy('http://'+self.usrpass+'@'+st[1])
            gnowmoz.servurl=self.url
            gnowmoz.s.getAuthUserid();
	except:
	    self.result="false"
	else:
	    self.result="true"
	
    	
    def gnowqlSearch(self,search_val,search_type):
	try:
            if search_val[0:5]=="ssid:":
                st= list()
                st.append(search_val[5:])
                res=list()
                res.append({'ssid':st[0]})
                res[0]['nid']=gnowmoz.s.getnids(st)[st[0]]
                res[0]['nodetype']=gnowmoz.s.getNodetype(st[0])
                
            else:
                if search_type=="All":
                    res=gnowmoz.s.search(search_val)
                else:
                    res=gnowmoz.s.search(search_val,[search_type])
        except:
            self.result="empty"
        else:
            if res==[]:
                self.result="empty"
            else:
                res=json.dumps(res)
                self.result = res

    def gnowqlPossibleSearch(self,search_val):
	try:
            res=gnowmoz.s.searchPossibleAttr(search_val,'title')
        except:
            self.result="empty"
        else:
            if res==[]:
                self.result="empty"
            else:
                if len(res)>=20:
                    max=20
                else:
                    max=len(res)
                st = list()
                for i in range(max):
                    st.append(res[i][1])
                    
                res=json.dumps(st)
                self.result = res

    def getsvg(self,ssid):
        gnowmoz.s.genNBHImage(ssid)
        st=gnowmoz.servurl.split("/gnowql")
        ft=st[0]+"/Data/nbhimages/"+ssid+".svg"
        if self.proxyenabled=="true":
            proxy_support= urllib2.ProxyHandler({"http": "http://"+self.proxyuser+":"+self.proxypass+"@"+self.proxyurl+"/"})
            opener = urllib2.build_opener(proxy_support, urllib2.HTTPHandler)
            urllib2.install_opener(opener)

        soc= urllib2.urlopen(ft)
        svg_data=soc.read()
        soc.close()
        # Change the svg to appropriate structure and add click functionality for MozGnowser
        svg_data=svg_data.replace('pt','')
        p = parseString(svg_data)
        for i in p.getElementsByTagName('a'):
            st=i.getAttribute('xlink:href')
            if st <> '':
                i.setAttribute('xlink:href','#')
                id = st[st.find('id=')+3:st.find('&purl')]
                cl= "top.SVGclick("+id+")"
                i.setAttribute('onclick',cl)
        svg_data = p.toxml()
        # Save the modified svg to the autozoomsvg folder for loading
        myid = "gnowmoz@gnowledge.org"
        em = components.classes["@mozilla.org/extensions/manager;1"].getService(components.interfaces.nsIExtensionManager)  
        file = em.getInstallLocation(myid).getItemFile(myid, "install.rdf")
        filestring = file.path
        filestring =str(filestring[:-11]+'chrome/gnowmoz/content/js/autozoomsvg/result.svg')
        filewrite= open(filestring,'w')
        filewrite.write(svg_data)
        filewrite.close()
        #st= gnowmoz.js.hello()
       
	
   
	
    def getnbh(self,ssid):
        st = list()
        st.append(ssid)
 	res=gnowmoz.s.getAllnbh(st)
        self.result=json.dumps(res)
	nbh=res[0]['rendered_nbh']
        htmlnbh = ""


        relationnids = []
        rolessids = []
	
        if nbh.has_key('relations'):
            relations = nbh['relations']
            htmlnbh= htmlnbh+"<b>RELATIONS : </b><br /><br />" 
            if relations <> {}:
                relationsnids = relations.keys()
                relationtypes = gnowmoz.s.getInverseNames(relationsnids)
   
            for rt in relationsnids:
                try:
                    rolessids = rolessids + relations[rt]['rightroles']
                except:
                    pass
                try:
                    rolessids = rolessids + relations[rt]['leftroles']
                except:
                    pass

            if rolessids <> []:    
                rolenids = gnowmoz.s.getnids( rolessids )

            for rt in relationsnids:
                val = ""
                if relations[rt].has_key('rightroles'):
                    subjectssids = relations[rt]['rightroles']
                    if subjectssids <> []:
                        htmlnbh = htmlnbh + "<b>"+rt +"</b>"+ " : "
                        for subject in subjectssids:
                            val=val+"<a href=\"#\" id=\""+subject+"\" class=\"nbh-click\"  >"+rolenids[subject]+"</a>"+", "
                    val = val[:-2]
                htmlnbh = htmlnbh + val + "<br /><br />"
                  
                val = ""
                if relations[rt].has_key('leftroles'):
                    subjectssids = relations[rt]['leftroles']
                    if subjectssids <> []:
                        htmlnbh = htmlnbh + "<b>"+relationtypes[rt] +"</b>"+ " : "
                        for subject in subjectssids:
                            val=val + "<a href=\"#\" id=\""+subject+"\" class=\"nbh-click\" >"+rolenids[subject]+"</a>"+", "
                  
                        val = val[:-2]
                    htmlnbh = htmlnbh + val + "<br /><br />"
       
                  
        if nbh.has_key('relationtypes'):
            rts = nbh['relationtypes']
            if rts <> []:
                rtnids = gnowmoz.s.getnids( rts )
                val = ""
                htmlnbh = htmlnbh + '<b>RELATIONTYPES</b>'+ " : "
                for rt in rts:
                    val = val + "<a href=\"#\" id=\""+rt+"\" class=\"nbh-click\" >"+rtnids[rt]+ "</a>"+", "
                val = val[:-2]
                htmlnbh = htmlnbh + val + "<br /><br />"

        if nbh.has_key('attributetypes'):
            rts = nbh['attributetypes']
            if rts <> []:
                rtnids = gnowmoz.s.getnids( rts )
                val = ""
                htmlnbh = htmlnbh + '<b>ATTRIBUTETYPES</b>' + " : "
                for rt in rts:
                    val = val + "<a href=\"#\" id=\""+rt+"\" class=\"nbh-click\" >"+rtnids[rt]+"</a>" + ", "
                val = val[:-2]
                htmlnbh = htmlnbh + val + "<br /><br />"
   


        htmlnbh = htmlnbh + "<br /><br />"


        if nbh.has_key('attributes'):
            attributes = nbh['attributes']
            htmlnbh = htmlnbh + "<b>ATTRIBUTES</b><br />"
            attributenids = attributes.keys()
            for attribute in attributenids:
                htmlnbh = htmlnbh + "<b>"+attribute +"</b>"+ " : " + str(attributes[attribute][1]) + "<br /><br />"
                
        htmlnbh = htmlnbh + "<br /><br />"
        
 
        self.rendered_nbh=htmlnbh

    def searchnid(self, ssid):
        st = list()
        st.append(ssid)
        try:
            res=gnowmoz.s.getnids(st)
        except:
            self.result="empty"
        else:
            if(res==[]):
                self.result="empty"
            else:
                self.result=json.dumps(res)

    def getrel(self):
	res=gnowmoz.s.getAll('gbrelationtypes')
	ret=res.keys()
	st=list()
	for relname in ret:
	    st.append( [relname] )
	st = st + [['isa']]
	st=json.dumps(st)
	self.result = st

    def getattribute(self):
	res = gnowmoz.s.getAll('gbattributetypes')
    	ret = res.keys()
    	factory = ['username','firstname','lastname','email','password','mandatoryflds','listdatatype']
	st=list()
    	for relname in ret:
            if relname not in factory:
            	st.append( [relname] )
	st=json.dumps(st)
	self.result=st
        

    def getdep(self):
	res = ['isa','dependson','requiredfor']
	st=json.dumps(res)
	self.result=st

    def addTriple(self,subject,pred,predicate,object0):
	rowcnt=1
	temp=self.usrpass.split(':')
	username=temp[0]
	uid = gnowmoz.s.getUserIdfromUsername(username)

	if not gnowmoz.s.nidExists(object0):
            input = {'status': 'public', 'nodetype': 'objecttype','nid':object0,'uid':uid,'language':'en'} 
            gnowmoz.s.setnode(input)
	
        if pred == 'rt':
            no_of_objects = rowcnt
            no_of_objects = int(no_of_objects)
            objects = []
            for obj in range(no_of_objects + 1):
                rightrole = object0
                if rightrole <> '':
                    objects.append(rightrole)


            if predicate == 'isa':
                for nt in objects:
                    input = {'nid':subject,'status':'public','nodetype':nt,'uid':uid}
                    st=gnowmoz.s.setnode( input )
	 	    self.result=json.dumps(st)
                                
            if predicate == 'subtypeof':
                if not gnowmoz.s.nidExists(subject):
                    latestssids = gnowmoz.s.getlatestssids( objects , 'nid' )
                    latestssids = latestssids.values()
                    input = {'nid':subject,'status':'public','nodetype':'objecttype','uid':uid,'subtypeof':latestssids}
                    st=gnowmoz.s.setnode( input )
		    self.result=json.dumps(st)
                else:
                    latestssids = gnowmoz.s.getlatestssids( [subject]+objects , 'nid' )
                    subjectid = latestssids[subject]
                    latestssids = latestssids.values()
                    latestssids.remove(subjectid)
                    input = {'status':'public','subject':subjectid,'commit':'1','relation':[(predicate,latestssids)]}
                    st=gnowmoz.s.Update( input )
		    self.result=json.dumps(st)
                    
            if predicate == 'instanceof':
                if not gnowmoz.s.nidExists(subject):
                    latestssids = gnowmoz.s.getlatestssids( objects , 'nid' )
                    latestssids = latestssids.values()
                    try:
                        input = {'nid':subject,'status':'public','nodetype':'object','uid':uid,'instanceof':latestssids}
                        st=gnowmoz.s.setnode( input )
		        self.result=json.dumps(st)
                        
                    except:
                        input = {'nid':subject,'status':'public','nodetype':'objecttype','uid':uid,'instanceof':latestssids}
                        st=gnowmoz.s.setnode( input )
			self.result=json.dumps(st)
                        
                else:
            
                    latestssids = gnowmoz.s.getlatestssids( [subject]+objects , 'nid' )
                    subjectid = latestssids[subject]
                    latestssids = latestssids.values()
                    latestssids.remove(subjectid)
                    input = {'status':'public','subject':subjectid,'commit':'1','relation':[(predicate,latestssids)]}
                    st=gnowmoz.s.Update( input )
		    self.result=json.dumps(st)
                     
        if pred == 'dp':
            no_of_objects = rowcnt
            no_of_objects = int(no_of_objects)
            objects = []
            for obj in range(no_of_objects + 1):
                rightrole = object0
                if rightrole <> '':
                    objects.append(rightrole)


            if predicate == 'isa':
                for nt in objects:
                    input = {'nid':subject,'status':'public','nodetype':nt,'uid':uid}
                    st=gnowmoz.s.setnode( input )
		    self.result=json.dumps(st)
                    
            if predicate == 'dependson':
                latestssids = gnowmoz.s.getlatestssids( [subject]+objects , 'nid' )
                subjectid = latestssids[subject]
                latestssids = latestssids.values()
                latestssids.remove(subjectid)
                input = {'status':'public','subject':subjectid,'commit':'1','relation':[(predicate,latestssids)]}
                st=gnowmoz.s.Update( input )
                self.result=json.dumps(st)
               

            if predicate == 'requiredfor':
                latestssids = gnowmoz.s.getlatestssids( [subject]+objects , 'nid' )
                subjectid = latestssids[subject]
                latestssids = latestssids.values()
                latestssids.remove(subjectid)
                for ssid in latestssids:
                    subjectid = gnowmoz.s.getlatestssids( [subject] , 'nid' )[subject]
                    input = {'status':'public','subject':ssid,'commit':'1','relation':[('dependson',[subjectid])]}
                    st=gnowmoz.s.Update( input )
                st=dict()
                st['new_subject_ssid']=gnowmoz.s.getlatestssids( [subject] , 'nid' )[subject]
                self.result=json.dumps(st)
        
        if pred == 'at':
            latestssids = context.gnowql.getlatestssids( [subject] , 'nid' )
            subjectid = latestssids[subject]
            input={'status':'Public','attributes':[(predicate,object0)],'subject':subjectid,'language':'english','commit':1}
            st = gnowmoz.s.Update( input )
            self.result=json.dumps(st)
                

                   
    def searchOptions(self, object0):
	ret=gnowmoz.s.search(object0)
	st=list()
	for i in range(len(ret)):
            st.append(ret[i]['nid'])
	flag=0
	for nt in st:
	    if object0 == nt:
		flag=1
	if flag==0:
  	    st.append('Create a New Node')
	self.result=json.dumps(st)

    def GnowQLshell(self, fname):
        if fname.find(';') <> -1:
            st = fname.replace('Moz','gnowmoz.s')
            st = st.split(';')
            res = ""
            for i in range(len(st)):
                try:
                    if st[i] <> '':
                        res = res + str(eval(st[i]))+'###########################'
                except Exception, e:
                    res = res + str(e)
        else:
            st = "gnowmoz.s."+fname
            try:
                res = eval(st)
            except Exception, e:
                res = str(e)
            
        self.result = json.dumps(res)
