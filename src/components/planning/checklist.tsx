"use client";

import { useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, isBefore, parseISO } from "date-fns";
import {
  Check,
  GripVertical,
  ListFilter,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Select } from "@/components/ui";
import {
  initialTasks,
  type ChecklistTask,
  type TaskStatus,
} from "@/lib/demo-data";
import { track } from "@/lib/analytics";
import { usePersistentState } from "@/lib/use-persistent-state";
import { SectionHeading } from "./section-heading";

function SortableTask({
  task,
  onStatus,
  onDelete,
  onEdit,
}: {
  task: ChecklistTask;
  onStatus: (status: TaskStatus) => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`grid gap-3 border-b border-[#e1d8ca] bg-white px-3 py-4 last:border-b-0 sm:grid-cols-[28px_1fr_145px_auto] sm:items-center ${isDragging ? "z-10 opacity-70 shadow-lg" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${task.title}`}
        className="hidden cursor-grab text-[#98988f] sm:block"
      >
        <GripVertical className="size-5" />
      </button>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-semibold ${task.status === "Completed" ? "text-[#77776f] line-through" : "text-[#30342f]"}`}
          >
            {task.title}
          </p>
          {task.priority === "High" && <Badge tone="terracotta">High</Badge>}
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-[#70716b]">
          {task.description}
        </p>
        <div className="mt-2 flex gap-3 text-[11px] text-[#77786f]">
          <span>{task.category}</span>
          <span>Due {format(parseISO(task.due), "MMM d, yyyy")}</span>
        </div>
      </div>
      <Select
        aria-label={`Status for ${task.title}`}
        value={task.status}
        onChange={(event) => onStatus(event.target.value as TaskStatus)}
        className="min-h-9 text-xs"
      >
        {["Not Started", "In Progress", "Waiting", "Completed"].map(
          (status) => (
            <option key={status}>{status}</option>
          ),
        )}
      </Select>
      <div className="flex justify-end">
        <Button
          variant="quiet"
          size="icon"
          aria-label={`Edit ${task.title}`}
          onClick={onEdit}
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          variant="quiet"
          size="icon"
          aria-label={`Delete ${task.title}`}
          onClick={onDelete}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function ChecklistSection() {
  const [tasks, setTasks] = usePersistentState("checklist-tasks", initialTasks);
  const [category, setCategory] = useState("All categories");
  const [status, setStatus] = useState("All statuses");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Venue",
    due: "2026-08-30",
    priority: "Medium",
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const categories = [...new Set(tasks.map((task) => task.category))];
  const filtered = useMemo(
    () =>
      tasks.filter(
        (task) =>
          (category === "All categories" || task.category === category) &&
          (status === "All statuses" || task.status === status),
      ),
    [tasks, category, status],
  );
  const completed = tasks.filter((task) => task.status === "Completed").length;
  const overdue = tasks.filter(
    (task) =>
      task.status !== "Completed" && isBefore(parseISO(task.due), new Date()),
  ).length;

  const dragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setTasks((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    toast.success("Checklist order saved.");
  };

  const addTask = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTask.title.trim()) {
      toast.error("Add a task title.");
      return;
    }
    setTasks((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        title: newTask.title.trim(),
        description: "Custom planning task",
        due: newTask.due,
        category: newTask.category,
        priority: newTask.priority as ChecklistTask["priority"],
        status: "Not Started",
      },
    ]);
    setNewTask((value) => ({ ...value, title: "" }));
    setShowAdd(false);
    toast.success("Task added to your checklist.");
  };

  return (
    <>
      <SectionHeading
        eyebrow="YOUR PLANNING ROADMAP"
        title="Checklist"
        description="A date-aware plan for the decisions ahead. Reorder tasks to reflect how you work."
        action={
          <Button onClick={() => setShowAdd((value) => !value)}>
            <Plus className="size-4" /> Add task
          </Button>
        }
      />

      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#72736d]">
            Completed
          </p>
          <p className="font-display mt-2 text-4xl text-[#263d32]">
            {completed}{" "}
            <span className="text-xl text-[#77786f]">of {tasks.length}</span>
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#72736d]">
            Overall progress
          </p>
          <p className="font-display mt-2 text-4xl text-[#263d32]">
            {Math.round((completed / tasks.length) * 100)}%
          </p>
          <div className="mt-3 h-1.5 bg-[#e5ded2]">
            <div
              className="h-full bg-[#7d8b72]"
              style={{ width: `${(completed / tasks.length) * 100}%` }}
            />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#72736d]">
            Needs attention
          </p>
          <p className="font-display mt-2 text-4xl text-[#a65f45]">{overdue}</p>
          <p className="text-xs text-[#72736d]">overdue tasks</p>
        </Card>
      </div>

      {showAdd && (
        <Card className="mb-5 border-t-4 border-t-[#b4935a] p-5">
          <form
            onSubmit={addTask}
            className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-end"
          >
            <label className="grid gap-2 text-xs font-semibold">
              Task title
              <Input
                value={newTask.title}
                onChange={(event) =>
                  setNewTask({ ...newTask, title: event.target.value })
                }
                autoFocus
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Category
              <Select
                value={newTask.category}
                onChange={(event) =>
                  setNewTask({ ...newTask, category: event.target.value })
                }
              >
                {[
                  "Venue",
                  "Budget",
                  "Guest List",
                  "Catering",
                  "Photography",
                  "Video",
                  "Entertainment",
                  "Florals",
                  "Attire",
                  "Invitations",
                  "Transportation",
                  "Ceremony",
                  "Reception",
                  "Legal Requirements",
                  "Final Details",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Due date
              <Input
                type="date"
                value={newTask.due}
                onChange={(event) =>
                  setNewTask({ ...newTask, due: event.target.value })
                }
              />
            </label>
            <label className="grid gap-2 text-xs font-semibold">
              Priority
              <Select
                value={newTask.priority}
                onChange={(event) =>
                  setNewTask({ ...newTask, priority: event.target.value })
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </Select>
            </label>
            <Button type="submit">
              <Check className="size-4" /> Save
            </Button>
          </form>
        </Card>
      )}

      {editId && (
        <Card className="mb-5 p-5">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setTasks((items) =>
                items.map((item) =>
                  item.id === editId ? { ...item, title: draftTitle } : item,
                ),
              );
              setEditId(null);
              toast.success("Task updated.");
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              aria-label="Edit task title"
              autoFocus
            />
            <Button type="submit">Save changes</Button>
            <Button
              type="button"
              variant="quiet"
              onClick={() => setEditId(null)}
            >
              Cancel
            </Button>
          </form>
        </Card>
      )}

      <Card>
        <div className="flex flex-col gap-3 border-b border-[#d8cdbd] p-4 sm:flex-row sm:items-center">
          <ListFilter className="hidden size-4 text-[#6f746f] sm:block" />
          <Select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="sm:max-w-52"
          >
            <option>All categories</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="sm:max-w-48"
          >
            <option>All statuses</option>
            {["Not Started", "In Progress", "Waiting", "Completed"].map(
              (item) => (
                <option key={item}>{item}</option>
              ),
            )}
          </Select>
          <p className="ml-auto text-xs text-[#77786f]">
            {filtered.length} tasks
          </p>
        </div>
        {filtered.length ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={dragEnd}
          >
            <SortableContext
              items={filtered.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {filtered.map((task) => (
                <SortableTask
                  key={task.id}
                  task={task}
                  onStatus={(nextStatus) => {
                    setTasks((items) =>
                      items.map((item) =>
                        item.id === task.id
                          ? { ...item, status: nextStatus }
                          : item,
                      ),
                    );
                    if (nextStatus === "Completed") {
                      track("checklist_task_completed", {
                        category: task.category,
                      });
                      toast.success("Task completed.");
                    }
                  }}
                  onDelete={() => {
                    setTasks((items) =>
                      items.filter((item) => item.id !== task.id),
                    );
                    toast.success("Task removed.");
                  }}
                  onEdit={() => {
                    setEditId(task.id);
                    setDraftTitle(task.title);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="p-12 text-center">
            <p className="font-display text-2xl text-[#263d32]">
              No tasks match these filters.
            </p>
            <Button
              variant="quiet"
              className="mt-3"
              onClick={() => {
                setCategory("All categories");
                setStatus("All statuses");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </Card>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 4).map((item) => {
          const categoryTasks = tasks.filter((task) => task.category === item);
          const percent = Math.round(
            (categoryTasks.filter((task) => task.status === "Completed")
              .length /
              categoryTasks.length) *
              100,
          );
          return (
            <Card key={item} className="p-4">
              <div className="flex justify-between text-xs font-semibold">
                <span>{item}</span>
                <span>{percent}%</span>
              </div>
              <div className="mt-3 h-1 bg-[#e3dcd0]">
                <div
                  className="h-full bg-[#b4935a]"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </Card>
          );
        })}
      </section>
    </>
  );
}
