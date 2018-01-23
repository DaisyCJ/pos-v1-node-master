//const datbase = require('../datbase');

module.exports = function main(input) {
    //获取要买物品信息
    const buy_Item=buyNeedItems(loadAllItems(),input);
    //获取打折信息
    discountItems(buy_Item,loadPromotions());
    var str=print(buy_Item);
    console.log(str);
    return 'Hello World!';
};

function buyNeedItems(allItems,input) {
    var splitMsg=splitMessage(input);
    var buy_Items=[];
    splitMsg.forEach(function (ele) {
        //在所有商品清单中找到该商品
        var itemsFromList=allItems.find(function(e){return e.barcode==ele.barcode;});
        var a=buy_Items.find(function(e){return e.barcode==ele.barcode});
        if(a){
            a.count++;
            a.sum_price+=a.price;
        }
        else {
            buy_Items.push({barcode: itemsFromList.barcode, name: itemsFromList.name,
                unit: itemsFromList.unit, price: itemsFromList.price,count:ele.count,sum_price:itemsFromList.price*ele.count});
        }
    });
    return buy_Items;
}

function splitMessage(str) {
    var split_str=[];
    str.forEach(function (ele) {
        if(ele.length==10){
            split_str.push({barcode:ele,count:1});
        }
        else split_str.push({barcode:ele.substring(0,10),count:parseInt(ele.substring(11,12))});
    });
    return split_str;
}

function discountItems(item,load_discount) {
    var item2=item;
    item2.forEach(function (ele) {
        if(load_discount[0].barcodes.indexOf(ele.barcode)>=0){
            ele.discount=parseInt(ele.count/3)*ele.price;
        }
        else ele.discount=0;
    });
    return item2;
}

function addPrice(item2) {
    var sum=0;
    item2.forEach(function (ele) {
        sum+=ele.price*ele.count-ele.discount;
    });
    return sum;
}

function print(buy_Item) {
    var str='***<没钱赚商店>购物清单***\n';
    for(var i=0;i<buy_Item.length;i++){
        str+= '名称：'+buy_Item[i].name+'，数量：'+buy_Item[i].count+buy_Item[i].unit+'，单价：'
            +(buy_Item[i].price).toFixed(2)+'(元)，小计：'+(buy_Item[i].sum_price-buy_Item[i].discount).toFixed(2)+'(元)\n';
    }
    str+='----------------------\n' +
        '挥泪赠送商品：\n';
    var discount=0;
    for(var j=0;j<buy_Item.length;j++){
        if(buy_Item[j].discount){
            str+='名称：'+buy_Item[j].name+'，数量：'+parseInt(buy_Item[j].count/3)+buy_Item[j].unit+'\n';
            discount+=buy_Item[j].discount;
        }
    }
    var sum=addPrice(buy_Item);
    str+='----------------------\n'+
        '总计：'+(sum).toFixed(2)+'(元)\n' +
        '节省：'+(discount).toFixed(2)+'(元)\n' +
        '**********************';
    return str;
}

function loadAllItems() {
    return [
        {
            barcode: 'ITEM000000',
            name: '可口可乐',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000001',
            name: '雪碧',
            unit: '瓶',
            price: 3.00
        },
        {
            barcode: 'ITEM000002',
            name: '苹果',
            unit: '斤',
            price: 5.50
        },
        {
            barcode: 'ITEM000003',
            name: '荔枝',
            unit: '斤',
            price: 15.00
        },
        {
            barcode: 'ITEM000004',
            name: '电池',
            unit: '个',
            price: 2.00
        },
        {
            barcode: 'ITEM000005',
            name: '方便面',
            unit: '袋',
            price: 4.50
        }
    ];
}

function loadPromotions() {
    return [
        {
            type: 'BUY_TWO_GET_ONE_FREE',
            barcodes: [
                'ITEM000000',
                'ITEM000001',
                'ITEM000005'
            ]
        }
    ];
}
