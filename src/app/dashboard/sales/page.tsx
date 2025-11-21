"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Sale {
    id: number;
    description: string;
    invoiceNumber?: string;
    type: "income" | "expense";
    amount: number;
    amountReceived: number;
    status: string;
    dueDate?: string;
    date: string;
    clientName?: string;
    clientId?: number;
    projectId?: number;
    projectName?: string;
    category?: string;
    paymentMethod?: string;
    personId?: number;
}

interface Client {
    id: number;
    name: string;
}

interface Project {
    id: number;
    name: string;
    clientId: number;
}

export default function SalesPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [timeFilter, setTimeFilter] = useState<string>("30d"); // 30d, 3m, 1y, fy, cy

    // Form State
    const [type, setType] = useState("income"); // income or expense
    const [subType, setSubType] = useState("invoice"); // invoice or sale (for income)
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [amountReceived, setAmountReceived] = useState("");
    const [status, setStatus] = useState("draft");
    const [dueDate, setDueDate] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [projectId, setProjectId] = useState("");
    const [clientId, setClientId] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    useEffect(() => {
        fetchSales();
        fetchClients();
        fetchProjects();
    }, []);

    useEffect(() => {
        fetchSales();
    }, [timeFilter]);

    const fetchSales = async () => {
        try {
            const url = `/api/transactions?timeFilter=${timeFilter}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json() as Sale[];
                setSales(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const res = await fetch("/api/clients");
            if (res.ok) {
                const data = await res.json() as Client[];
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch clients", error);
        }
    };

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects");
            if (res.ok) {
                const data = await res.json() as Project[];
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        }
    };

    const openDialog = (sale?: Sale) => {
        if (sale) {
            setEditingSale(sale);
            setType(sale.type);
            setSubType(sale.invoiceNumber ? "invoice" : "sale");
            setDescription(sale.description);
            setAmount(sale.amount.toString());
            setAmountReceived(sale.amountReceived?.toString() || "");
            setStatus(sale.status || "draft");
            setDueDate(sale.dueDate ? new Date(sale.dueDate).toISOString().split('T')[0] : "");
            setInvoiceNumber(sale.invoiceNumber || "");
            setProjectId(sale.projectId ? sale.projectId.toString() : "");
            setClientId(sale.clientId ? sale.clientId.toString() : "");
            setCategory(sale.category || "");
            setPaymentMethod(sale.paymentMethod || "");
        } else {
            resetForm();
        }
        setOpen(true);
    };

    const resetForm = () => {
        setEditingSale(null);
        setType("income");
        setSubType("invoice");
        setDescription("");
        setAmount("");
        setAmountReceived("");
        setStatus("draft");
        setDueDate("");
        setInvoiceNumber("");
        setProjectId("");
        setClientId("");
        setCategory("");
        setPaymentMethod("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                type,
                description,
                amount,
                date: new Date().toISOString(),
                category: type === 'income' ? 'sales' : category,
                amountReceived: subType === 'sale' ? amount : amountReceived,
                status: subType === 'sale' ? 'paid' : status,
                dueDate,
                invoiceNumber: subType === 'invoice' ? invoiceNumber : undefined,
                projectId: projectId ? parseInt(projectId) : undefined,
                clientId: clientId ? parseInt(clientId) : undefined,
                paymentMethod: type === 'expense' ? paymentMethod : undefined,
            };

            if (editingSale) {
                // Update
                const res = await fetch(`/ api / sales / ${editingSale.id} `, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchSales();
                }
            } else {
                // Create
                const res = await fetch("/api/sales", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    setOpen(false);
                    resetForm();
                    fetchSales();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openDeleteDialog = (sale: Sale) => {
        setSaleToDelete(sale);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!saleToDelete) return;
        try {
            const res = await fetch(`/ api / sales / ${saleToDelete.id} `, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchSales();
                setDeleteDialogOpen(false);
                setSaleToDelete(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredSales = useMemo(() => {
        return sales.filter(s =>
        (s.description?.toLowerCase().includes(search.toLowerCase()) ||
            s.clientName?.toLowerCase().includes(search.toLowerCase()) ||
            s.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
            s.amount.toString().includes(search))
        );
    }, [sales, search]);

    const incomeTotal = useMemo(() => {
        return sales
            .filter(s => s.type === 'income')
            .reduce((acc, curr) => acc + curr.amount, 0);
    }, [sales]);

    const expenseTotal = useMemo(() => {
        return sales
            .filter(s => s.type === 'expense')
            .reduce((acc, curr) => acc + curr.amount, 0);
    }, [sales]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales & Finance</h1>
                <Button onClick={() => { resetForm(); setOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Record Transaction
                </Button>
            </div>

            {/* Time Filter */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                <Button
                    variant={timeFilter === "30d" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter("30d")}
                >
                    30 Days
                </Button>
                <Button
                    variant={timeFilter === "3m" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter("3m")}
                >
                    3 Months
                </Button>
                <Button
                    variant={timeFilter === "1y" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter("1y")}
                >
                    1 Year
                </Button>
                <Button
                    variant={timeFilter === "fy" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter("fy")}
                >
                    FY
                </Button>
                <Button
                    variant={timeFilter === "cy" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTimeFilter("cy")}
                >
                    CY
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{incomeTotal.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{expenseTotal.toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${incomeTotal - expenseTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{(incomeTotal - expenseTotal).toLocaleString('en-IN')}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction Dialog */}
            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val);
                if (!val) resetForm();
            }}>
                <DialogTrigger asChild>
                    <div style={{ display: 'none' }} />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingSale ? "Edit Transaction" : "Record New Transaction"}</DialogTitle>
                        <DialogDescription>
                            {editingSale ? "Update transaction details." : "Create an invoice or record a direct sale."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSave}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income">Income</SelectItem>
                                        <SelectItem value="expense">Expense</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="col-span-3"
                                    required
                                    placeholder={type === 'income' ? "e.g. Website Design Project" : "e.g. Office Supplies"}
                                />
                            </div>
                            {type === 'income' && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="subType" className="text-right">Category</Label>
                                    <Select value={subType} onValueChange={setSubType}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="invoice">Invoice</SelectItem>
                                            <SelectItem value="sale">Direct Sale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {type === 'income' && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="project" className="text-right">Project</Label>
                                    <Select value={projectId} onValueChange={(val) => {
                                        setProjectId(val);
                                        // Auto-populate client from project
                                        const project = projects.find(p => p.id === parseInt(val));
                                        if (project) {
                                            setClientId(project.clientId.toString());
                                        }
                                    }}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Project (Optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">No Project</SelectItem>
                                            {projects.map(project => (
                                                <SelectItem key={project.id} value={project.id.toString()}>
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {type === 'income' && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="client" className="text-right">Client</Label>
                                    <Select value={clientId} onValueChange={setClientId}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select Client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            {type === 'income' && subType === 'invoice' && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="invoiceNumber" className="text-right">Invoice #</Label>
                                    <Input
                                        id="invoiceNumber"
                                        value={invoiceNumber}
                                        onChange={e => setInvoiceNumber(e.target.value)}
                                        className="col-span-3"
                                        placeholder="Auto-generated if empty"
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">Total Amount (₹)</Label>
                                <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} className="col-span-3" required />
                            </div>
                            {type === 'income' && subType === 'invoice' && (
                                <>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="received" className="text-right">Received (₹)</Label>
                                        <Input id="received" type="number" value={amountReceived} onChange={e => setAmountReceived(e.target.value)} className="col-span-3" placeholder="0.00" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                                        <Input id="dueDate" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">Status</Label>
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="sent">Sent</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="partial">Partial</SelectItem>
                                                <SelectItem value="overdue">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">{editingSale ? "Update Transaction" : "Save Transaction"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 max-w-md"
                />
            </div>

            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>

                {["all", "income", "expenses"].map((tabValue) => (
                    <TabsContent key={tabValue} value={tabValue} className="mt-4">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Client / Category</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({ length: 5 }).map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                                </TableRow>
                                            ))
                                        ) : filteredSales
                                            .filter(s => tabValue === 'all' || (tabValue === 'income' ? s.type === 'income' : s.type === 'expense'))
                                            .map((sale) => (
                                                <TableRow key={sale.id}>
                                                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {sale.description}
                                                        {sale.invoiceNumber && <div className="text-xs text-gray-500">#{sale.invoiceNumber}</div>}
                                                    </TableCell>
                                                    <TableCell>{sale.clientName || sale.category || "-"}</TableCell>
                                                    <TableCell className="capitalize">
                                                        <Badge variant={sale.type === 'income' ? 'outline' : 'secondary'}>
                                                            {sale.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className={sale.type === 'income' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                                        {sale.type === 'income' ? '+' : '-'}₹{sale.amount.toLocaleString('en-IN')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {sale.type === 'income' && (
                                                            <Badge variant={sale.status === 'paid' ? 'default' : sale.status === 'overdue' ? 'destructive' : 'secondary'}>
                                                                {sale.status}
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDialog(sale)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => openDeleteDialog(sale)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        {filteredSales.length === 0 && !loading && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">No transactions found.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                title="Delete Transaction"
                description={`Are you sure you want to delete this ${saleToDelete?.type}? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div >
    );
}

