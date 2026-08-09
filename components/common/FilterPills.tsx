/** 渲染可横向滚动的通用筛选胶囊按钮，并报告当前选项变更。 */
interface FilterPillsProps<T extends { id: string; name: string }> {
  items: T[];
  activeId: string;
  onChange: (item: T) => void;
  ariaLabel: string;
}

const FilterPills = <T extends { id: string; name: string }>({
  items,
  activeId,
  onChange,
  ariaLabel,
}: FilterPillsProps<T>) => (
  <nav
    aria-label={ariaLabel}
    className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
  >
    <div className="flex min-w-max gap-2 py-1">
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(item)}
            className={`editorial-focus editorial-filter min-h-10 whitespace-nowrap px-4 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primarySoft text-primaryStrong"
                : "hover:bg-muted hover:text-ink"
            }`}
          >
            {item.name}
          </button>
        );
      })}
    </div>
  </nav>
);

export default FilterPills;
