"use client";

import { Category } from "@ditch/lib";
import { PopoverClose } from "@radix-ui/react-popover";
import { SearchIcon } from "lucide-react";
import { useLocale } from "next-intl";

import { useCategoriesSelect } from "@/components/product/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type ProductCategorySelectProps = {
  category: Partial<Category> | undefined;
  setCategory: (category: Partial<Category>) => void;
  error?: string;
};

function ProductCategorySelect({
  category,
  setCategory,
  error
}: ProductCategorySelectProps) {
  const locale = useLocale();
  const {
    categories,
    parentId,
    setParentId,
    handleCategorySearchChange,
    categoriesLoading
  } = useCategoriesSelect({ locale });

  return (
    <div className={"grid gap-2 justify-start"}>
      <Label>{locale === "ru" ? "Категория" : "Category"}</Label>
      {error && <p className={"text-sm text-destructive"}>{error}</p>}
      <div className={"flex items-center justify-start gap-2"}>
        {category && (
          <p className={"text-base font-semibold"}>
            {locale === "ru" ? category.nameRu : category.nameEn}
          </p>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"primary-outline"}
              size={"sm"}
              className={"max-w-fit"}
              type={"button"}
            >
              {category ? "Change" : "Select"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className={"sm:w-full grid gap-4"}>
            <div className={"flex items-center gap-4"}>
              <div className={"relative w-full"}>
                <SearchIcon
                  className={
                    "absolute top-1/2 left-2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                  }
                />
                <Input
                  onChange={handleCategorySearchChange}
                  className={"w-full pl-8"}
                  placeholder={"Search for category..."}
                />
              </div>
              <PopoverClose asChild>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className={"text-destructive hover:text-destructive"}
                >
                  Cancel
                </Button>
              </PopoverClose>
            </div>

            <div className={"flex items-center justify-center"}>
              <ScrollArea className={"h-48 w-1/2"}>
                <div className={"grid"}>
                  {!categories?.parentCategories ||
                    (categories?.parentCategories?.length === 0 && (
                      <div
                        className={
                          "p-2 text-sm w-full rounded-md text-muted-foreground"
                        }
                      >
                        No categories found
                      </div>
                    ))}
                  {categories?.parentCategories?.map((parentCategory) => (
                    <div
                      key={parentCategory.id}
                      className={cn(
                        "p-2 text-sm w-full rounded-md hover:bg-muted",
                        {
                          "bg-muted": parentCategory.id === parentId
                        }
                      )}
                      onClick={() => setParentId(parentCategory.id)}
                    >
                      {locale === "ru"
                        ? parentCategory.nameRu
                        : parentCategory.nameEn}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Separator orientation={"vertical"} />
              <ScrollArea className={"h-48 w-1/2"}>
                <div className={"grid"}>
                  {categoriesLoading && <p>Loading...</p>}
                  {!categories?.subcategories ||
                    (categories?.subcategories?.length === 0 && (
                      <div
                        className={
                          "p-2 text-sm w-full rounded-md text-muted-foreground"
                        }
                      >
                        No categories found
                      </div>
                    ))}
                  {categories?.subcategories?.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      className={cn(
                        "p-2 text-sm w-full rounded-md hover:bg-muted",
                        {
                          "bg-muted": category?.id === subcategory.id
                        }
                      )}
                      onClick={() => setCategory(subcategory)}
                    >
                      {locale === "ru"
                        ? subcategory.nameRu
                        : subcategory.nameEn}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default ProductCategorySelect;
