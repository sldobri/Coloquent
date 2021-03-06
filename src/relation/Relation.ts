import {Model} from "../Model";
import {Reflection} from "../util/Reflection";
export class Relation
{
    private relatedType;

    private referringObject: Model;

    private name: string;

    constructor(relatedType, referringObject: Model = null, name: string = null)
    {
        this.relatedType = relatedType;
        this.referringObject = referringObject;
        if (name === null) {
            name = Reflection.getNameOfNthMethodOffStackTrace(new Error(), 2);
        }
        this.name = name;
    }

    public getType(): any
    {
        return this.relatedType;
    }

    public getReferringObject(): Model
    {
        if (!this.referringObject) {
            throw new Error(
                "Referring type not set on this relation. You should define the relation on your model with e.g." +
                " 'this.hasMany(...)' instead of with 'new ToManyRelation(...)'"
            )
        }
        return this.referringObject;
    }

    public getName(): string
    {
        if (!this.name) {
            throw new Error(
                "Cannot deduce name of relation. You should define the relation on your model with e.g." +
                " 'this.hasMany(...)' instead of with 'new ToManyRelation(...)'"
            );
        }
        return this.name;
    }
}