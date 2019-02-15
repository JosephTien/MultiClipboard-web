//***************************************************
var chach=""
var cursor=null
var tele=false
var socket=io('', {transports: ['websocket']})
socket.on('welcome', function (data) {
    var uuid=getUUID()
    if('clipboard' in navigator){
        socket.emit('require', { uuid: uuid, ask: false })
    }else{
        socket.emit('require', { uuid: uuid, ask: true })
    }
})
socket.on('data', function (data) {
    setUUID(data.uuid)
    strarr=data.strarr
    $('#qrcode').empty()
    $('#qrcode').qrcode({
        text: getURLStr(data.uuid),
        width : 128,
        height: 128,
    })
})
socket.on('clipboard', function (data) {
    tele=true
    if('cursor' in data){
        cursor=data.cursor
    }else{
        cursor=null
    }
    setText(data.str)
})
socket.on('ask', function (data) {
    shareText(getText())
})
//***************************************************
$(window).focus(function() {
    $('#cover').hide()
})
$(window).blur(function() {
    $('#cover').show()
})
$('#cover').hide()
$('#qrcode').click(function(){
    var uuid=getUUID()
    var code=getURLStr(uuid)
    setText(code)
    shareText(code)
})
$('#copy').click(function(){
    $('#bkup').val(getText())
    $('#bkup').select()
    document.execCommand('copy');
})
//***************************************************
/*
$area=$('#area')
$area.bind('input propertychange', function() {
    //$area.attr('rows', area.val().split('\n').length)
    shareClip()
    navigator.clipboard.writeText($area.val())
})
autosize($area)
$area.focus(function(){
    navigator.clipboard.readText().then(function(val) {
        if(chach!=''){
            navigator.clipboard.writeText(chach)
            chach=''
        }else{
            $area.val(val)
            shareClip()
        }
    }).catch(function(err) {
        console.log(err)
    })
})
$area.blur(function(){
    $area.focus()
})
$area.focus()
*/
//***************************************************
var editor=CodeMirror.fromTextArea(document.getElementById('area'), {
    lineNumbers: true,
    autofocus: true
});
editor.setSize("100%","100%")
editor.on('change', function() {
    writeToClipOrChach(getText())
    if(!tele){
        shareText(getText())
        cursor=null
    }else{
        if(cursor!=null){
            editor.setCursor(cursor)
        }
        tele=false
    }
})
editor.on('focus',function(){
    if(cursor!=null){
        editor.setCursor(cursor)
        cursor=null
    }
    if(!('clipboard' in navigator)){ return }
    navigator.clipboard.readText().then(function(val) {
        if(val!=getText()){
            setText(val)
            shareText(val)
        }else if(chach!=''){
            if(chach!=getText()){
                setText(chach)
                shareText(chach)
            }else{
                writeToClipOrChach(chach)
            }
        }
    }).catch(function(err){
        writeToClipOrChach(chach)
    })
})
editor.on('blur',function(){
    cursor=null
    editor.focus()
})
//***************************************************
function getUUID(){
    var nodes=document.cookie.split(';')
    for(var i=0;i<nodes.length;i++){
        var tokens=nodes[i].split('=')
        if(tokens[0].trim()==='id'){
            if(tokens.length<2){ return '' }
            return tokens[1].trim()
        }
    }
    return ''
}
function setUUID(str){
    document.cookie='id='+str
}
function writeToClipOrChach(str){
    chach=''
    if(!('clipboard' in navigator)){ 
        chach=str
        return 
    }
    navigator.clipboard.writeText(str).catch(function(err){
        chach=str
    })
}
function shareText(str){
    socket.emit('clipboard', { uuid: getUUID(), str: str, src: 'web', cursor: editor.getCursor()})
}
function setText(str){
    //$('#area').val(str)
    editor.setValue(str)
    editor.setCursor(editor.lineCount(), 0)
}
function getText(){
    //return $('#area').val(str)
    return editor.getValue()
}
function getURLStr(id){
    var path=window.location.href.split('?')[0]
    return path+'?id='+id
}