'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Id } from '../../convex/_generated/dataModel';

type User = {
  _id: string;
  email: string;
  name: string;
  _creationTime: number;
  emailVerificationTime?: number;
  image?: string;
};

type Member = {
  _id: string;
  user: User;
};

interface MultipleSelectorProps {
  users: Member[] | undefined;
  onChange?: (selectedUserIds: Id<'users'>[]) => void;
  initialValues?: Id<'users'>[];
  placeholder?: string;
}

export function MultipleUserSelector({
  users = [],
  onChange,
  initialValues = [],
  placeholder = 'Select users...',
}: MultipleSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<Id<'users'>[]>(initialValues);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSetValue = (userId: Id<'users'>) => {
    let newValue: Id<'users'>[];

    if (value.includes(userId)) {
      newValue = value.filter(id => id !== userId);
    } else {
      newValue = [...value, userId];
    }

    setValue(newValue);
    onChange?.(newValue);
  };

  const handleRemoveUser = (userId: Id<'users'>) => {
    const newValue = value.filter(id => id !== userId);
    setValue(newValue);
    onChange?.(newValue);
  };

  const getSelectedUsers = () =>
    value
      .map(userId => users?.find(member => member.user._id === userId)?.user)
      .filter((user): user is User => user !== undefined);

  const filteredUsers = users?.filter(member =>
    member.user.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-full justify-between"
        >
          <div className="flex gap-2 justify-start items-center flex-wrap">
            {value.length > 0 ? (
              getSelectedUsers().map(user => (
                <div
                  key={user._id}
                  className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium flex items-center gap-1"
                >
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                      {user.name?.[0] ?? user.email?.[0] ?? '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name ?? user.email ?? 'Anonymous User'}</span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveUser(user._id as Id<'users'>);
                    }}
                    className="ml-1 text-red-500 hover:text-red-700"
                    aria-label="Remove user"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0">
        <Command>
          <CommandInput
            placeholder="Search users..."
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No users found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {filteredUsers?.map(member => (
                <CommandItem
                  key={member._id}
                  value={member.user._id}
                  onSelect={() => {
                    handleSetValue(member.user._id as Id<'users'>);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(member.user._id as Id<'users'>)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.user.image} />
                      <AvatarFallback>
                        {member.user.name?.[0] ?? member.user.email?.[0] ?? '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span>{member.user.name ?? 'Anonymous User'}</span>
                      {member.user.email && (
                        <span className="text-xs text-muted-foreground">
                          {member.user.email}
                        </span>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
