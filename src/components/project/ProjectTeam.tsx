import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface TeamMember {
    id: number;
    name: string;
    role: string;
    email: string;
    personId?: number; // For compatibility if needed, but main ID is 'id'
}

interface Person {
    id: number;
    name: string;
    email: string;
}

interface ProjectTeamProps {
    teamMembers: TeamMember[];
    people: Person[];
    projectId: number;
    onTeamChange: () => void;
    currentUserRole?: string;
}

export function ProjectTeam({ teamMembers, people, projectId, onTeamChange, currentUserRole }: ProjectTeamProps) {
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [memberRole, setMemberRole] = useState("member");

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPersonId) return;

        try {
            const res = await fetch(`/api/projects/${projectId}/team`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    personId: parseInt(selectedPersonId),
                    role: memberRole,
                }),
            });
            if (res.ok) {
                setAddMemberOpen(false);
                setSelectedPersonId("");
                setMemberRole("member");
                onTeamChange();
            }
        } catch (error) {
            console.error("Failed to add team member", error);
        }
    };

    const handleRemoveMember = async (memberId: number) => {
        if (!confirm("Remove this team member?")) return;
        try {
            const res = await fetch(`/api/projects/${projectId}/team/${memberId}`, {
                method: "DELETE",
            });
            if (res.ok) onTeamChange();
        } catch (error) {
            console.error("Failed to remove team member", error);
        }
    };

    const availablePeople = people.filter(
        p => !teamMembers.some(tm => tm.id === p.id)
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Members</h3>
                {currentUserRole === "admin" && (
                    <Button onClick={() => setAddMemberOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Add Member
                    </Button>
                )}
            </div>

            <div className="space-y-3">
                {teamMembers.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No team members yet</p>
                ) : (
                    teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>
                                        <UserCircle className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                                </div>
                            </div>
                            {currentUserRole === "admin" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveMember(member.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Member Dialog */}
            <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                        <DialogDescription>
                            Add a person to this project team
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="person">Person *</Label>
                                <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a person" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availablePeople.map((person) => (
                                            <SelectItem key={person.id} value={person.id.toString()}>
                                                {person.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select value={memberRole} onValueChange={setMemberRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lead">Lead</SelectItem>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="contributor">Contributor</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setAddMemberOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Add Member</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    );
}
