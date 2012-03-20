
    var raizAVL;

    function AVLNode(dato,izq,der ){
        this.dato = dato;
        this.izquierdo = izq;       // arbol izquierdo
        this.derecho = der;         // arbol derecho
        this.height = 0;            // altura predeterminada
    }

    function insertar( x ){

        if($("input[name='modo']:checked").val()=="continuo" || confirm("Agregar el nodo "+x+" ?")){
            raizAVL = insert( x, raizAVL );
            if(raizAVL.padre==null)
                $("#nodo"+raizAVL.dato).css({left:(screen.width-30)/2});
            
            maxSpace=getMaxSpace(raizAVL.height);
            exploreTree(raizAVL,maxSpace);
            jsPlumb.repaintEverything();
        }
    }

    function insert( x, node){

        if( node == null ){
            node = new AVLNode( x, null, null );
            $("#arbol").append('<div class="window" id="nodo'+x+'">'+x+'</div>');
            
        }
        else if( x < node.dato ) {
            node.izquierdo = insert( x, node.izquierdo );            
            node.izquierdo.padre=node;
            jsPlumb.connect({source:'nodo'+node.dato, target:'nodo'+node.izquierdo.dato, overlays:[]});            
            swapTrees(node.izquierdo,node,'leftOf');
            if( height( node.izquierdo ) - height( node.derecho ) == 2 )
                if( x < node.izquierdo.dato )
                    node = rotateWithLeftChild( node ); /* Caso 1 */
                else
                    node = doubleWithLeftChild( node ); /* Caso 2 */
        }
        else if( x > node.dato ) {
            node.derecho = insert( x, node.derecho );
            node.derecho.padre=node;
            jsPlumb.connect({source:'nodo'+node.dato, target:'nodo'+node.derecho.dato, overlays:[]});            
            swapTrees(node.derecho,node,'rightOf');

            if( height( node.derecho ) - height( node.izquierdo ) == 2 )
                if( x > node.derecho.dato )
                    node = rotateWithRightChild( node ); /* Caso 4 */                                                 
                else
                    node = doubleWithRightChild( node ); /* Caso 3 */
        }
        else
            ; // Duplicado; no hago nada

        node.height = max( height( node.izquierdo ), height( node.derecho ) ) + 1;
       
        return node;

    }

    /******************************ROTACIONES************************************/

    function  rotateWithLeftChild( k2 ){
        var k1 = k2.izquierdo;
        if($("input[name='modo']:checked").val()=="continuo" || confirm("Quitar la relalacion padre-hijo entre "+k2.dato+" y "+k1.dato+" ?")){
            jsPlumb.detach({source:'nodo'+k2.dato,target:'nodo'+k1.dato});//Quitamos la relalacion padre-hijo entre ke y k1
            jsPlumb.repaintEverything();
        }
        
        //Se asigna el padre de k2 como padre de k1
        if($("input[name='modo']:checked").val()=="continuo" || confirm("Asignar el padre de "+k2.dato+" como el padre "+k1.dato+" ?")){
            k1.padre=k2.padre;                             
            if(k2.padre!=null)
            {               
                jsPlumb.detach({source:'nodo'+k2.padre.dato,target:'nodo'+k2.dato});
                jsPlumb.connect({source:'nodo'+k2.padre.dato, target:'nodo'+k1.dato, overlays:[]});                
            }
            swapTrees(k1,k2,'insteadOf')//Movemos k1 a donde estaba k2
            jsPlumb.connect({source:'nodo'+k1.dato, target:'nodo'+k2.dato, overlays:[]});            
            jsPlumb.repaintEverything();
        }

        if($("input[name='modo']:checked").val()=="continuo" || confirm("Movemos el nodo derecho de "+k1.dato+" al nodo izquierdo "+k2.dato+" ?")){
            if(k1.derecho!=null){//Movemos el nodo derecho de k1 al nodo izquierdo de k2
                jsPlumb.detach({source:'nodo'+k1.dato,target:'nodo'+k1.derecho.dato});
                
                k1.derecho.padre=k2;
                k2.izquierdo = k1.derecho;
                jsPlumb.connect({source:'nodo'+k2.dato, target:'nodo'+k1.derecho.dato, overlays:[]});
                
                swapTrees(k1.derecho,k2,'rightOf');
                jsPlumb.repaintEverything();
            }else{            
                k2.izquierdo = k1.derecho; 
            }
        }
        if($("input[name='modo']:checked").val()=="continuo" || confirm("Movemos "+k2.dato+" el nodo derecho de "+k1.dato+" ?")){
            //Reconectamos k1 como padre y k2 como hijo
            k1.derecho = k2;
            swapTrees(k2,k1,'leftOf');        
            jsPlumb.repaintEverything();
            k2.padre=k1;            
        }
           
        k2.height = max( height(k2.derecho), height(k2.izquierdo) ) + 1;
        k1.height = max( height( k1.izquierdo ), k2.height ) + 1;
        return k1;
        
    }


    function  rotateWithRightChild( k1 ){        
        var k2 = k1.derecho;
        if($("input[name='modo']:checked").val()=="continuo" || confirm("Quitar la relalacion padre-hijo entre "+k1.dato+" y "+k2.dato+" ?")){
            jsPlumb.detach({source:'nodo'+k1.dato,target:'nodo'+k2.dato});//Quitamos la relalacion padre-hijo entre ke y k2
            jsPlumb.repaintEverything();
        }
        
        //Se asigna el padre de k1 como padre de k2
        if($("input[name='modo']:checked").val()=="continuo" || confirm("Asignar el padre de "+k1.dato+" como el padre "+k2.dato+" ?")){
            k2.padre=k1.padre;                             
            if(k1.padre!=null)
            {               
                jsPlumb.detach({source:'nodo'+k1.padre.dato,target:'nodo'+k1.dato});
                jsPlumb.connect({source:'nodo'+k1.padre.dato, target:'nodo'+k2.dato, overlays:[]});                
            }
            swapTrees(k2,k1,'insteadOf')//Movemos k2 a donde estaba k1
            jsPlumb.connect({source:'nodo'+k2.dato, target:'nodo'+k1.dato, overlays:[]});            
            jsPlumb.repaintEverything();
        }

        if($("input[name='modo']:checked").val()=="continuo" || confirm("Movemos el nodo Izquierdo de "+k2.dato+" al nodo derecho "+k1.dato+" ?")){
            if(k2.izquierdo!=null){//Movemos el nodo Izquierdo de k2 al nodo derecho de k1
                jsPlumb.detach({source:'nodo'+k2.dato,target:'nodo'+k2.izquierdo.dato});
                
                k2.izquierdo.padre=k1;
                k1.derecho = k2.izquierdo;
                jsPlumb.connect({source:'nodo'+k1.dato, target:'nodo'+k2.izquierdo.dato, overlays:[]});
                
                swapTrees(k2.izquierdo,k1,'rightOf');
                jsPlumb.repaintEverything();
            }else{            
                k1.derecho = k2.izquierdo; 
            }
        }

        if($("input[name='modo']:checked").val()=="continuo" || confirm("Movemos "+k1.dato+" el nodo Izquierdo de "+k2.dato+" ?")){
            //Reconectamos K2 como padre y K1 como hijo
            k2.izquierdo = k1;
            swapTrees(k1,k2,'leftOf');        
            jsPlumb.repaintEverything();
            k1.padre=k2;            
        }
           
        k1.height = max( height(k1.izquierdo), height(k1.derecho) ) + 1;
        k2.height = max( height( k2.derecho ), k1.height ) + 1;
        return k2;
    }


    function  doubleWithLeftChild( k3 ){
        k3.izquierdo = rotateWithRightChild( k3.izquierdo );
        return rotateWithLeftChild( k3 );
    }


    function  doubleWithRightChild( k1 ){
        k1.derecho = rotateWithLeftChild( k1.derecho );
        return rotateWithRightChild( k1 );
    }

    /*******************************************************************************/

    function max(lhs, rhs ){
        return lhs > rhs ? lhs : rhs;
    }

    function height( node ){
        return node == null ? -1 : node.height;
    }

    function calcularAltura( node ){
       if (node == null)
            return -1;
       else
            return 1 + Math.max(calcularAltura(node.izquierdo), calcularAltura(node.derecho));
    }

    function getMaxSpace(altura){
        return (Math.pow(2,altura)*30)+(Math.pow(2,altura)*20);
    }

    function exploreTree(nodo,espacio){
        
        if (nodo==null)
            return;
        
        var leftPosFather=$("#nodo"+nodo.dato).offset().left;
        var rightPosFather=leftPosFather+30;
        var topPosFather=parseInt($("#nodo"+nodo.dato).css("top").replace("px",""));
        
        if(nodo.izquierdo!=null){   
            $("#nodo"+nodo.izquierdo.dato).css({left:leftPosFather-(espacio/2)});
            $("#nodo"+nodo.izquierdo.dato).css({top:topPosFather+150});
        //jsPlumb.connect({source:'nodo'+nodo.dato, target:'nodo'+nodo.izquierdo.dato, overlays:[]});        

            exploreTree(nodo.izquierdo,espacio/2);
        }

        if(nodo.derecho!=null){
            $("#nodo"+nodo.derecho.dato).css({left:rightPosFather+(espacio/2)});
            $("#nodo"+nodo.derecho.dato).css({top:topPosFather+150});   
            //jsPlumb.connect({source:'nodo'+nodo.dato, target:'nodo'+nodo.derecho.dato, overlays:[]});        
            exploreTree(nodo.derecho,espacio/2);
        }
    }    

    function moveTree(nodo,x,y){
        if (nodo==null)
            return;
        
        $("#nodo"+nodo.dato).css({ top: $("#nodo"+nodo.dato).position().top+y , left: $("#nodo"+nodo.dato).position().left+x });
        jsPlumb.repaintEverything();
        
        if(nodo.izquierdo!=null)                      
            moveTree(nodo.izquierdo,x,y);        

        if(nodo.derecho!=null)          
            moveTree(nodo.derecho,x,y);        
    }

    //Mover el nodo 1 al lugar del nodo 2 con sus subarboles
    function swapTrees(nodo,nodo2,posicion){
        var x,y,x1,x2,y1,y2;

        if (nodo==null)
            return;
        
        x1=$("#nodo"+nodo.dato).offset().left;
        y1=$("#nodo"+nodo.dato).offset().top;

        x2=$("#nodo"+nodo2.dato).offset().left;
        y2=$("#nodo"+nodo2.dato).offset().top; 


        switch(posicion){
            case 'leftOf':                               
                x=x2-150-x1;
                y=(y2+150)-y1;
            break;
            case 'insteadOf':                            
                x=x2-x1;
                y=y2-y1;
            break;
            case 'rightOf':
                x=x2+200-x1;
                y=(y2+150)-y1;
            break;
        }    
        
        moveTree(nodo,x,y);
    }


    function generaAVL(){

        limpiarAVL()
        raizAVL=null;
        jsPlumb.unload()
        var elementos=$("#datos").val().split(",");
        for(i=0;i<elementos.length;i++){
            insertar(parseInt(elementos[i]));
        }
    }

    function limpiarAVL(){
        $("#arbol > *").remove();
    }
