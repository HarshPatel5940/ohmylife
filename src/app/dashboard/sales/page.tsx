"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
    invoiceNumber?: string;
    type: "invoice" | "sale";
    amount: number;
    amountReceived: number;
    status: string;
    dueDate?: string;
    date: string;
    clientName?: string;
    clientId?: number;
}

interface Client {
    id: number;
    name: string;
}

export default function SalesPage() {
    const router = useRouter();
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);

    const [clients, setClients] = useState<Client[]>([]);

    // Form State
    const [type, setType] = useState("income"); // income or expense
    const [subType, setSubType] = useState("invoice"); // invoice or sale (for income)
    const [amount, setAmount] = useState("");
    const [amountReceived, setAmountReceived] = useState("");
    const [status, setStatus] = useState("draft");
    const [dueDate, setDueDate] = useState("");
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [clientId, setClientId] = useState("");

    useEffect(() => {
        fetchSales();
        fetchClients();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await fetch("/api/sales");
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

    const openDialog = (sale?: Sale) => {
        if (sale) {
            setEditingSale(sale);
            setType(sale.type);
            setSubType(sale.invoiceNumber ? "invoice" : "sale");
            setAmount(sale.amount.toString());
            setAmountReceived(sale.amountReceived.toString());
            setStatus(sale.status);
            setDueDate(sale.dueDate ? new Date(sale.dueDate).toISOString().split('T')[0] : "");
            setInvoiceNumber(sale.invoiceNumber || "");
            setClientId(sale.clientId ? sale.clientId.toString() : "");
        } else {
            resetForm();
        }
        setOpen(true);
    };

    const resetForm = () => {
        setEditingSale(null);
        setType("income");
        setSubType("invoice");
        setAmount("");
        setAmountReceived("");
        setStatus("draft");
        setDueDate("");
        setInvoiceNumber("");
        setClientId("");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                type, // income or expense
                amount,
                amountReceived: subType === 'sale' ? amount : amountReceived,
                status: subType === 'sale' ? 'paid' : status,
                dueDate,
                invoiceNumber: subType === 'invoice' ? invoiceNumber : undefined,
                clientId: clientId ? parseInt(clientId) : undefined,
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
            s.clientName?.toLowerCase().includes(search.toLowerCase()) ||
            s.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
            s.amount.toString().includes(search)
        );
    }, [sales, search]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sales & Finance</h1>
                <Dialog open={open} onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Record Transaction
                        </Button>
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
            </div>

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
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="sales">Direct Sales</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Ref #</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Received</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                                <TableCell><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredSales.map((sale) => (
                                        <TableRow key={sale.id}>
                                            <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                            <TableCell className="font-medium">{sale.invoiceNumber || "-"}</TableCell>
                                            <TableCell>{sale.clientName || "-"}</TableCell>
                                            <TableCell className="capitalize">{sale.type}</TableCell>
                                            <TableCell>₹{sale.amount.toLocaleString('en-IN')}</TableCell>
                                            <TableCell className="text-green-600">₹{sale.amountReceived.toLocaleString('en-IN')}</TableCell>
                                            <TableCell>
                                                <Badge variant={sale.status === 'paid' ? 'default' : sale.status === 'overdue' ? 'destructive' : 'secondary'}>
                                                    {sale.status}
                                                </Badge>
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
                                    {sales.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">No transactions found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Add filtered contents for other tabs if needed */}
            </Tabs>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                title="Delete Transaction"
                description={`Are you sure you want to delete this ${saleToDelete?.type}? This action cannot be undone.`}
                confirmText="Delete"
            />
        </div>
    );
}
