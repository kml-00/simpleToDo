var ToDoControler= (function() {

    var ToDo = function(id,description,status)
    {
        this.id = id;
        this.description = description;
        this.status = status;
    };

    
    var  todo = [];
    
    var getMaxIndex = function() {
        ids = todo.map(function(current){
            return current.id;
        });
        var max=Math.max.apply(null,ids);
        return max;
    };
    var getIndex=function(id) {
        ids = todo.map(function(current){
            return current.id;
        });

        index = ids.indexOf(parseInt(id));
        return index;
    };
    

    return {
        addToDo: function(desc,stat){
            var id,Newitem;
            if(todo.length>0)
            {
                var max =getMaxIndex()+1;
                id=max;
                
            }
            else {
                id=0;
            }
            newItem = new ToDo(id,desc,stat);
            todo.push(newItem);
           
            return newItem;
        },

        loadToDo: function(id,desc,stat){
           
            var newItem;
            newItem = new ToDo(id,desc,stat);
            todo.push(newItem);
           
            return newItem;
        },
        

        delToDo: function(id) {
            
            var index=getIndex(id);
            if(index!==-1)
            {
                todo.splice(index,1);
            }
               
            
        },
        editToDo: function(id,desc) {

            var index=getIndex(id);
            if(index!==-1)
            {
                todo[index].description=desc;
            }
             
        },
        doneTodo:function(id){

            var index=getIndex(id);
            var status=todo[index].status;
            if(status===0){
                todo[index].status=1;
            }
            else {
                todo[index].status=0;
            }
        },

       
        

        

       
        testing: function() {
            console.log(todo);
        }
    }

})();


var UIControler = (function() {

    var DOMElements = {
        inputTodo: '.todo',
        add_ToDO: '.addItem',
        edit_ToDO:'.saveItem',
        del_ToDo: '.item_delete',
        done_ToDo: '.item_done',
        todo_list: '.todo_list',
        todo_item:'.item_todo',
        addID:'add',
        editID:'edit'

    };

    

    return {
        getInput:function() {
            
            return  document.querySelector(DOMElements.inputTodo).value;
            
        },

        setInput:function(value) {
            document.querySelector(DOMElements.inputTodo).value=value;
        },

        AddItemUI:function(item) {
            var html,newHtml;
 
            html= '<div class="item clearfix %item_done_back%" id="%id%"><div class="item_todo %item_cross%">%todoitem%</div><div class="controls"><div class="item_done %item_done_icon%"><i class="icon ion-md-done-all"></i></div><div class="item_edit"><i class="icon ion-md-create"></i></div><div class="item_delete"><i class="icon ion-md-trash"></i></div></div></div>';
            
            newHtml = html.replace('%id%', item.id);
            
            newHtml = newHtml.replace('%todoitem%',item.description );

            if(item.status==1)
            {
                newHtml = newHtml.replace('%item_done_back%','item_done_back' );
                newHtml = newHtml.replace('%item_cross%','item_cross_out' );
                newHtml = newHtml.replace('%item_done_icon%','item_done_icon' ); 
            }
            else{
                newHtml = newHtml.replace('%item_done_back%','' );
                newHtml = newHtml.replace('%item_cross%','' );
                newHtml = newHtml.replace('%item_done_icon%','' );
            }
            
            document.querySelector(DOMElements.todo_list).insertAdjacentHTML('beforeend', newHtml);
            AppControler.addEventListener(item.id);
        },

        delToDo:function(element) {
            element.parentNode.removeChild(element);
            
        },

        doneToDo:function(id) {
            var list=document.getElementById(id);
            // add toggle classes  
            list.classList.toggle("item_done_back")
            list.firstChild.classList.toggle("item_cross_out");
            list.lastChild.firstChild.classList.toggle("item_done_icon");
        },
        
        editToDo:function()
        {
            document.getElementById(DOMElements.addID).classList.toggle("add");
            document.getElementById(DOMElements.editID).classList.toggle("save");
        },

        getDOMElements:function() {
            return DOMElements;
        },

        

        clearInput:function() {
            document.querySelector(DOMElements.inputTodo).value='';
        }
    };



})();

var AppControler = (function(ToDoCtrl, UICtrl) {
    
    var desc="",el;
    
    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMElements();

        document.getElementById('add').addEventListener('click',ctrAddToDo);   
    };
    
    var addEventListener= function(id){
        var element=document.getElementById(id);
        element.lastElementChild.firstChild.addEventListener('click',ctrDoneToDo);
        element.lastElementChild.lastChild.addEventListener('click',ctrDelToDo);
    }

    var ctrAddToDo =function() {
        var input,item;
     
        input =UICtrl.getInput();
        item=ToDoControler.addToDo(input,0);
       
        UICtrl.AddItemUI(item);
        
        ToDoControler.testing();
        UICtrl.clearInput();
    
    }
    var ctrDelToDo = function(event) {
        var element =event.target.parentNode.parentNode.parentNode;
        ToDoControler.delToDo(parseInt(element.id));
        console.log(element.id);
        UICtrl.delToDo(element);

    }
    var ctrEditToDo = function(event){
        desc=event.target.parentNode.parentNode.parentNode.firstChild;
        el=event.target.parentNode.parentNode.parentNode.id;
        UICtrl.setInput(desc.innerHTML);
        AppControler.addEventListenerEdit('edit');
        UICtrl.editToDo();
    }
    var saveToDO =function(){
       
        var value=UICtrl.getInput();
        AppControler.removeEventListenerEdit('edit');
        UICtrl.editToDo();
        desc.innerHTML=value;
        ToDoControler.editToDo(parseInt(el),value);
        UICtrl.clearInput();
        
    }

    var ctrDoneToDo = function(event) {
        var id=event.target.parentNode.parentNode.parentNode.id;
        UICtrl.doneToDo(id);
        ToDoControler.doneTodo(parseInt(id));
        ToDoControler.testing();
    }
    return {
        init: function() {
            console.log('Application has started.');

            ToDoControler.testing();
            setupEventListeners();
            
        },
        addEventListener: function(id){
            var element=document.getElementById(id);
            element.lastElementChild.firstChild.addEventListener('click',ctrDoneToDo);
            element.lastElementChild.querySelector('.item_edit').addEventListener('click',ctrEditToDo);
            element.lastElementChild.lastChild.addEventListener('click',ctrDelToDo);
        },

        addEventListenerEdit:function(id) {
            document.getElementById(id).addEventListener('click',saveToDO);
        },
        removeEventListenerEdit:function(id) {
            document.getElementById(id).removeEventListener('click',saveToDO);
        }
       
    };

})(ToDoControler,UIControler);

AppControler.init();