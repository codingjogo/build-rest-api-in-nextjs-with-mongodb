import { model, models, Schema } from "mongoose";

const WhatIfSchema = new Schema(
	{
		whatIf: { type: "string", required: true, unique: true},
    crazy: { type: "string", required: true, unique: true},
	},
	{
		timestamps: true,
	}
);

const WhatIf = models.WhatIf || model("WhatIf", WhatIfSchema);

export default WhatIf;  
