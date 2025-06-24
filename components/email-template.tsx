import React from "react";

interface EmailTemplateProps{
    firstname: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstname,
}) => (
    <div>
        <h1>Welcome, {firstname}</h1>
    </div>
)