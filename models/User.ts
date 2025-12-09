import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para TypeScript
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'agent';
    cc?: string; // Cédula (opcional para agentes)
    createdAt: Date;
    updatedAt: Date;
}

// Schema de Mongoose
const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        },
        role: {
            type: String,
            enum: ['client', 'agent'],
            default: 'client',
            required: true,
        },
        cc: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

// Prevenir modelo duplicado en hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
