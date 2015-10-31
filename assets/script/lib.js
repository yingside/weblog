(function(){
    if(!window.YG) window['YG'] = {};
    function $() {
        var elements = new Array();

        for (var i = arguments.length - 1; i >= 0; i--) {
            var element = arguments[i];

            if (typeof element == "string") {
                element = document.getElementById(element);
            }

            if (arguments.length == 1) {
                return element;
            } else {
                elements.push(element);
            }
        };
        return elements;
    };
    window['YG']['$'] = $;

    //����¼�
    function addEvent(node, type, listener) {
        if (!(node = $(node))) return false;
        if (node.addEventListener) {
            //W3C
            node.addEventListener(type, listener, false);
            return true;
        } else if (node.attachEvent) {
            node['e' + type + listener] = listener;
            node[type + listener] = function() {
                node['e' + type + listener](window.event);
            };
            node.attachEvent('on' + type, node[type + listener]);
            return true;
        }

        return false;

    };
    window['YG']['addEvent'] = addEvent;

    //�Ƴ��¼�
    function removeEvent(node,type,listener){
        if (!(node = $(node))) return false;
        if(node.removeEventListener){
            node.removeEventListener(type,listener,false);
            return true;
        }else if(node.removeEvent){
            node.detachEvent('on'+type,node[type+listener]);
            node[type+listener] = null;
            return true;
        }
        return false;
    };
    window['YG']['removeEvent'] = removeEvent;
    //��ȡ�¼�����
    function getEventObject(e){
        return e || window.event;

    }
    window['YG']['getEventObject'] = getEventObject;
    //��֯�¼�ð��
    function stopPropagation(eventObject){
        var eventObject = eventObject || getEventObject();
        if(eventObject.stopPropagation){
            eventObject.stopPropagation();
        }else{
            eventObject.cancelBubble = true;
        }
    };
    window['YG']['stopPropagation'] = stopPropagation;

    //��ֹ�����Ĭ�� �¼�
    function stopDefault(eventObject){
        var eventObject = eventObject || getEventObject();
        if(eventObject.preventDefault){
            eventObject.preventDefault();
        }else{
            eventObject.returnValue = false;
        }
    };
    window['YG']['stopDefault'] = stopDefault;
    //��ȡ���λ��
    function getPointerPositionInDocument(eventObject) {
        eventObject = eventObject || getEventObject(eventObject);
        var x = eventObject.pageX || (eventObject.clientX +
            (document.documentElement.scrollLeft || document.body.scrollLeft));
        var y = eventObject.pageY || (eventObject.clientY +
            (document.documentElement.scrollTop || document.body.scrollTop));
        return {
            'x': x,
            'y': y
        };
    };
    window['YG']['getPointerPositionInDocument'] = getPointerPositionInDocument;
    //��ȡԪ��λ�úͳߴ�
    function getDimensions(element){
        if (!(element = $(element))) return false;

        return {
            'left':element.offsetLeft,
            'top':element.offsetTop,
            'width':element.offsetWidth,
            'height':element.offsetHeight
        };
    }
    window['YG']['getDimensions'] = getDimensions;

    //����CSS��ʽ
    function setStyles(element, styles) {
        if (!(element = $(element))) return false;
        for (property in styles) {
            if (!styles.hasOwnProperty(property)) continue;

            if (element.style.setProperty) {
                element.style.setProperty(
                    uncamelize(property, '-'), styles[property], null);
            } else {
                element.style[camelize(property)] = styles[property];
            }
        }
        return true;
    };
    window['YG']['setStyles'] = setStyles;

    //��CSS��ʽ�ַ���ת����JS��ʽ text-align==>textAlign
    function camelize(s) {
        return s.replace(/-(\w)/g, function(strMatch, p1) {
            return p1.toUpperCase();
        });
    };
    window['YG']['camelize'] = camelize;

    //��JS��ʽ�ַ���ת��ΪCSS��ʽ fontSize==>font-size
    function uncamelize(s, sep) {
        sep = sep || '-';
        return s.replace(/([a-z])([A-Z])/g, function(strMatch, p1, p2) {
            return p1 + sep + p2.toLowerCase();
        });
    };
    window['YG']['uncamelize'] = uncamelize;

    function getElementPos(element){
        if(!(element = $(element))) return false;
        var left = element.offsetLeft;
        left += element.clientLeft;
        var top = element.offsetTop;
        top += element.clientTop;

        var current = element.offsetParent;

        while(current){
            top += current.offsetTop + current.clientTop;
            left += current.offsetLeft + current.clientLeft;
            current = current.offsetParent;
        }

        return {
            "x":left,
            "y":top,
            "width":element.offsetWidth,
            "height":element.offsetHeight
        };
    }

    window['YG']['getElementPos'] = getElementPos;

})();
