class AppError extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
        this.status=`${statusCode}`.startsWith('4')?'fail':'error';
        //error object er is operational mark korar jonno extend korchi
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports=AppError;