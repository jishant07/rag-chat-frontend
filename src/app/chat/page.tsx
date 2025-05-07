"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { DocumentList } from "@/components/document-list";
import { NavActions } from "@/components/nav-actions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        // alert(localStorage.getItem("user") as string);
    }, []);
    return (
        <SidebarProvider >
            <AppSidebar  />
            <SidebarInset className="bg-gray-900 text-white">
                <header className="flex h-14 shrink-0 items-center gap-2">
                    <div className="flex flex-1 items-center gap-2 px-3 ">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="line-clamp-1 font-black text-white">Document List</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="m-auto flex flex-1 flex-col gap-4 px-4 py-10">
                    <DocumentList />
                </div>
                <div>
                    <Link href="/">
                        <button
                            onClick={() => {
                                localStorage.clear();
                            }}
                            className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </Link>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
