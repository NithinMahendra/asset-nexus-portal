
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AuditLogStub: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Audit Log</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        Audit log UI coming soon. Sensitive operations will be tracked here.
      </p>
    </CardContent>
  </Card>
);

export default AuditLogStub;
