function confusionMatrix() {

var y_pred = [0, 1, 42, 5, 32, 40, 11, 19, 22, 37]
var y_true = [0, 0, 42, 1, 32, 35, 11, 19, 21, 37]

let matrix = new Array(48).fill(0).map(() => new Array(48).fill(0));

for(var i=0;i<y_pred.length;i++)
    matrix[y_pred[i]][y_true[i]] +=1

    return matrix
}