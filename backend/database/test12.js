let date = new Date('2017-05-02')
dateValue = date.toISOString()

newDate = date.getMonth() + 1


console.log(new Date(date.setMonth(date.getMonth() + 1)).toISOString())
