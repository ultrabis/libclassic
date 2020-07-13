import CommonNumberResult from './CommonNumberResult';
import CommonStringResult from './CommonStringResult';
export default interface DPS {
    min: CommonNumberResult;
    max: CommonNumberResult;
    avg: CommonNumberResult;
    text: CommonStringResult;
}
