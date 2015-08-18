var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var styles={
	ready:{backgroundColor:"green",color:"yellow"}
}
var getFilesFromKsanajs=function() {
	var o={};
	ksana.js.files.map(function(file){
		if (file.substr(file.length-4)!==".kdb") return;
		kdbid=file.substr(file.lastIndexOf("/")+1);
		kdbid=kdbid.substr(0,kdbid.length-4);

		o[kdbid]=file;
	});
	return o;
}
var HTMLFileOpener=React.createClass({
	propTypes:{
		files:PT.object // { kdbid:url}
		,onReady:PT.func.isRequired
	}
	,getInitialState:function() {
		return {ready:{} };
	}
	,renderStatus:function(kdbid,url) {
		if(this.state.ready[kdbid]){
			return E("span",{style:styles.ready},"Ready");
		} else {
			return E("span",null,E("a",{href:url},"Download "));
		}
	}
	,renderFileStatus:function(){
		var o=[];
		for (var kdbid in this.props.files) {
			var url=this.props.files[kdbid];
			o.push(E("div",{key:kdbid},kdbid+".kdb ",this.renderStatus(kdbid,url)));
		}
		return o;
	}
	,getDefaultProps:function(){
		return {files:getFilesFromKsanajs()};
	}
	,openFile:function(e) {
		var files=e.target.files;
		var ready=this.state.ready;
		for (var i=0;i<files.length;i++) {
			var kdbid=files[i].name;
			kdbid=kdbid.substr(0,kdbid.length-4);
			if (this.props.files[kdbid]) {
				ready[kdbid]=files[i];
			}
		}
		if (Object.keys(ready).length==Object.keys(this.props.files).length) {
			this.props.onReady(ready);
		}
		this.setState({ready:ready});
	}
	,render:function() {
		var opts={type:"file", accept:".kdb", onChange:this.openFile}
		if (Object.keys(this.props.files).length>1) opts.multiple="multiple";
    return E("div",null
    	, this.renderFileStatus()
    	, E("input",opts)
    	,"click download if you don't have the kdb on your disk"
    );
	}
});
module.exports=HTMLFileOpener;